#!/usr/bin/env python3
"""
Script to extract facility data from PDF and import to Supabase
Usage: python3 import_pdf_to_supabase.py <pdf_file_path>
"""

import sys
import re
from pathlib import Path
import PyPDF2
from supabase import create_client
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

SUPABASE_URL = "https://qrzyguktfyxfexnwzmfy.supabase.co"
SUPABASE_KEY = "sb_publishable_R9YZ5kwh-4K7_TnzSN-lKQ_Rovm1uUv"

# Initialize Supabase client
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

def extract_text_from_pdf(pdf_path):
    """Extract text from PDF file"""
    text = ""
    try:
        with open(pdf_path, 'rb') as file:
            reader = PyPDF2.PdfReader(file)
            for page in reader.pages:
                text += page.extract_text()
        return text
    except Exception as e:
        print(f"Error reading PDF: {e}")
        return ""

def parse_facilities(text):
    """
    Parse facility information from PDF text.
    This is a simplified parser - adjust regex patterns based on your PDF structure.
    """
    facilities = []

    # Split by facility name patterns (e.g., "FROEDTERT BLUEMOUND...")
    facility_blocks = re.split(r'({[A-Z\s]+})', text)

    for i, block in enumerate(facility_blocks):
        if block.strip().startswith('{') and block.strip().endswith('}'):
            facility_name = block.strip('{}').strip()

            # Get the next block which contains facility details
            if i + 1 < len(facility_blocks):
                details = facility_blocks[i + 1]

                # Extract key information
                facility = extract_facility_details(facility_name, details)
                if facility:
                    facilities.append(facility)

    return facilities

def extract_facility_details(name, details_text):
    """Extract structured facility data from text block"""
    facility = {
        'name': name,
        'region': 'Wisconsin',
        'health_system': '',
        'specialty': '',
        'recruiting': False,
        'onboarding': False,
        'required_experience': '',
        'orientation_dates': '',
        'facility_requirements': '',
        'dormancy_policy': '',
        'current_employee_protocol': ''
    }

    # Extract health system (usually before specialty)
    health_system_match = re.search(r'(Froedtert|ThedaCare|[A-Z][a-z\s]+)', details_text[:100])
    if health_system_match:
        facility['health_system'] = health_system_match.group(1).strip()

    # Extract specialty
    specialty_keywords = ['RN', 'CNA', 'Tech', 'Therapist', 'Phlebotomist', 'ER', 'ICU', 'MedSurg', 'Tele']
    for keyword in specialty_keywords:
        if keyword in details_text:
            facility['specialty'] = keyword
            break

    # Extract recruiting/onboarding status
    if 'recruiting' in details_text.lower() and 'true' in details_text.lower():
        facility['recruiting'] = True
    if 'onboarding' in details_text.lower() and 'true' in details_text.lower():
        facility['onboarding'] = True

    # Extract required experience
    exp_match = re.search(r'(\d+\.?\d*\s*(?:years?|months?))', details_text)
    if exp_match:
        facility['required_experience'] = exp_match.group(1).strip()

    # Extract other fields (basic extraction)
    if 'orientation' in details_text.lower():
        lines = details_text.split('\n')
        for line in lines:
            if 'orientation' in line.lower():
                facility['orientation_dates'] = line.strip()

    return facility

def manual_facility_data():
    """
    Manually defined facility data from the PDF.
    This is more reliable than automated parsing for complex PDFs.
    """
    return [
        # FROEDTERT BLUEMOUND REHABILITATION HOSPITAL
        {
            'name': 'Froedtert Bluemound Rehabilitation Hospital',
            'region': 'Wisconsin',
            'health_system': 'Froedtert',
            'specialty': 'MedSurg RN',
            'recruiting': True,
            'onboarding': True,
            'required_experience': '1.5 years',
            'orientation_dates': 'Must be cleared through Froedtert first',
            'facility_requirements': 'Rhythm strip documentation/interpretation not required',
            'dormancy_policy': '90 days after last worked shift',
            'current_employee_protocol': 'If the professional is previous employee, eligibility to return is determined using the HR database, Lawson.'
        },
        {
            'name': 'Froedtert Bluemound Rehabilitation Hospital',
            'region': 'Wisconsin',
            'health_system': 'Froedtert',
            'specialty': 'Hospital CNA',
            'recruiting': True,
            'onboarding': True,
            'required_experience': '1 year',
            'orientation_dates': 'Must be cleared through Froedtert first',
            'facility_requirements': 'POCT- BG, obtain VS, daily weights, assist with hygiene and ADLs, transport, COP with restraints, & patient lifts.',
            'dormancy_policy': '90 days after last worked shift',
            'current_employee_protocol': 'If the professional is previous employee, eligibility to return is determined using the HR database, Lawson.'
        },
        {
            'name': 'Froedtert Bluemound Rehabilitation Hospital',
            'region': 'Wisconsin',
            'health_system': 'Froedtert',
            'specialty': 'ER RN',
            'recruiting': True,
            'onboarding': True,
            'required_experience': '2 years',
            'orientation_dates': 'Must be cleared through Froedtert first',
            'facility_requirements': 'At least Level II Trauma experience required. NIH, Needs one: ATON Certificate, ITIS Certificate, TNCC Certificate or TEWC Certificate',
            'dormancy_policy': '90 days after last worked shift',
            'current_employee_protocol': 'If the professional is previous employee, eligibility to return is determined using the HR database, Lawson.'
        },
        {
            'name': 'Froedtert Bluemound Rehabilitation Hospital',
            'region': 'Wisconsin',
            'health_system': 'Froedtert',
            'specialty': 'ICU RN',
            'recruiting': True,
            'onboarding': True,
            'required_experience': '2 years',
            'orientation_dates': 'Must be cleared through Froedtert first',
            'facility_requirements': 'ACLS, NIH. **Recent Epic experience required. **Ask if they have CVICU and/or TICU Strong ACLS skills, proficiency with central lines, ventilator management, titrating vasopressors to target vitals, neurologic checks, wound drains and EVDs, and cardiac monitoring.',
            'dormancy_policy': '90 days after last worked shift',
            'current_employee_protocol': 'If the professional is previous employee, eligibility to return is determined using the HR database, Lawson.'
        },
        {
            'name': 'Froedtert Bluemound Rehabilitation Hospital',
            'region': 'Wisconsin',
            'health_system': 'Froedtert',
            'specialty': 'Tele RN',
            'recruiting': True,
            'onboarding': True,
            'required_experience': '1.5 years',
            'orientation_dates': 'Must be cleared through Froedtert first',
            'facility_requirements': 'BLS only. Can be floated to ED to take care of holds',
            'dormancy_policy': '90 days after last worked shift',
            'current_employee_protocol': 'If the professional is previous employee, eligibility to return is determined using the HR database, Lawson.'
        },
        # FROEDTERT HOSPITAL WAUWATOSA & MENOMONEE FALLS
        {
            'name': 'Froedtert Hospital Wauwatosa & Menomonee Falls',
            'region': 'Wisconsin',
            'health_system': 'Froedtert',
            'specialty': 'ER RN',
            'recruiting': False,
            'onboarding': False,
            'required_experience': '2 years',
            'orientation_dates': 'Orientation every Monday (refer to Orientation Fulfillment Tracker for dates)',
            'facility_requirements': 'At least Level II Trauma experience required. NIH, Needs one: ATON Certificate, ITIS Certificate, TNCC Certificate or TEWC Certificate',
            'dormancy_policy': '90 days after last worked shift',
            'current_employee_protocol': 'Employee - 3 month waiting period. Froedtert is merging with ThedaCare. Please screen pros for previous employment with ThedaCare and Froedtert. Same 3 month waiting period applies for previous ThedaCare employees. If the professional was a traveler and wants to transition to CareRev, the waiting period is 1 YEAR (effective 10/2/2026).'
        },
        {
            'name': 'Froedtert Hospital Wauwatosa & Menomonee Falls',
            'region': 'Wisconsin',
            'health_system': 'Froedtert',
            'specialty': 'ICU RN',
            'recruiting': False,
            'onboarding': False,
            'required_experience': '2 years',
            'orientation_dates': 'Orientation every Monday (refer to Orientation Fulfillment Tracker for dates)',
            'facility_requirements': 'ACLS, NIH. **Recent Epic experience required. **Ask if they have CVICU and/or TICU Strong ACLS skills, proficiency with central lines, ventilator management, titrating vasopressors to target vitals, neurologic checks, wound drains and EVDs, and cardiac monitoring.',
            'dormancy_policy': '90 days after last worked shift',
            'current_employee_protocol': 'Employee - 3 month waiting period. Froedtert is merging with ThedaCare. Please screen pros for previous employment with ThedaCare and Froedtert. Same 3 month waiting period applies for previous ThedaCare employees.'
        },
        {
            'name': 'Froedtert Hospital Wauwatosa & Menomonee Falls',
            'region': 'Wisconsin',
            'health_system': 'Froedtert',
            'specialty': 'Tele RN',
            'recruiting': False,
            'onboarding': False,
            'required_experience': '1.5 years',
            'orientation_dates': 'Orientation every Monday (refer to Orientation Fulfillment Tracker for dates)',
            'facility_requirements': 'BLS only. Can be floated to ED to take care of holds',
            'dormancy_policy': '90 days after last worked shift',
            'current_employee_protocol': 'Employee - 3 month waiting period. Froedtert is merging with ThedaCare. Please screen pros for previous employment with ThedaCare and Froedtert. Same 3 month waiting period applies for previous ThedaCare employees.'
        },
        {
            'name': 'Froedtert Hospital Wauwatosa & Menomonee Falls',
            'region': 'Wisconsin',
            'health_system': 'Froedtert',
            'specialty': 'MedSurg RN',
            'recruiting': False,
            'onboarding': False,
            'required_experience': '1.5 years',
            'orientation_dates': 'Orientation every Monday (refer to Orientation Fulfillment Tracker for dates)',
            'facility_requirements': 'Rhythm strip documentation/interpretation not required',
            'dormancy_policy': '90 days after last worked shift',
            'current_employee_protocol': 'Employee - 3 month waiting period. Froedtert is merging with ThedaCare. Please screen pros for previous employment with ThedaCare and Froedtert. Same 3 month waiting period applies for previous ThedaCare employees.'
        },
        {
            'name': 'Froedtert Hospital Wauwatosa & Menomonee Falls',
            'region': 'Wisconsin',
            'health_system': 'Froedtert',
            'specialty': 'Hospital CNA',
            'recruiting': False,
            'onboarding': False,
            'required_experience': '1 year',
            'orientation_dates': 'Orientation every Monday (refer to Orientation Fulfillment Tracker for dates)',
            'facility_requirements': 'POCT- BG, obtain VS, daily weights, assist with hygiene and ADLs, transport, COP with restraints, & patient lifts.',
            'dormancy_policy': '90 days after last worked shift',
            'current_employee_protocol': 'Employee - 3 month waiting period. Froedtert is merging with ThedaCare. Please screen pros for previous employment with ThedaCare and Froedtert. Same 3 month waiting period applies for previous ThedaCare employees.'
        },
        {
            'name': 'Froedtert Hospital Wauwatosa & Menomonee Falls',
            'region': 'Wisconsin',
            'health_system': 'Froedtert',
            'specialty': 'IP Resp. Therapist',
            'recruiting': False,
            'onboarding': False,
            'required_experience': '1 year',
            'orientation_dates': 'RRT Required, ACLS',
            'facility_requirements': 'Acute hospital experience at a mid to large-sized hospital experience is required. LTACH experience doesn\'t count. ICU experience is required.',
            'dormancy_policy': '90 days after last worked shift',
            'current_employee_protocol': 'Employee - 3 month waiting period'
        },
        {
            'name': 'Froedtert Hospital Wauwatosa & Menomonee Falls',
            'region': 'Wisconsin',
            'health_system': 'Froedtert',
            'specialty': 'ED Tech',
            'recruiting': False,
            'onboarding': False,
            'required_experience': '6 months',
            'orientation_dates': 'CNA cert/lic, HS Diploma or GED, BLS',
            'facility_requirements': 'Must have CNA or EMT license. IV experience required. Foley cath and straight cath experience required. Must show competency with specimen collection, blood glucose monitoring, first aid measures, wound care, dressing applications, and preparation of supplies for procedures.',
            'dormancy_policy': '90 days after last worked shift',
            'current_employee_protocol': 'Employee - 3 month waiting period'
        },
        {
            'name': 'Froedtert Hospital Wauwatosa & Menomonee Falls',
            'region': 'Wisconsin',
            'health_system': 'Froedtert',
            'specialty': 'IP Phlebotomist',
            'recruiting': False,
            'onboarding': False,
            'required_experience': '6 months',
            'orientation_dates': 'Pro MUST have hospital experience and at least 100 venipunctures in past year',
            'facility_requirements': 'No Phleb course or state-approved training course is required. So MAKE SURE these Pros are STRONG on clinical questions. Used in inpatient, outpatient, and ER. Mostly adult patients, minimal peds (neonate/heel sticks). Responds to traumas and rapids. Complete legal draws (will train).',
            'dormancy_policy': '90 days after last worked shift',
            'current_employee_protocol': 'Employee - 3 month waiting period'
        },
        # FROEDTERT MEQUON HOSPITAL
        {
            'name': 'Froedtert Mequon Hospital',
            'region': 'Wisconsin',
            'health_system': 'Froedtert',
            'specialty': 'ER RN',
            'recruiting': True,
            'onboarding': True,
            'required_experience': '2 years',
            'orientation_dates': 'Level III Trauma experience required. Expected to recover surgical patients. ACLS, NIH Needs one: ATON Certificate, ITIS Certificate, TNCC Certificate or TEWC Certificate',
            'facility_requirements': 'At least Level III Trauma experience required. Expected to recover surgical patients. ACLS, NIH Needs one: ATON Certificate, ITIS Certificate, TNCC Certificate or TEWC Certificate',
            'dormancy_policy': '90 days after last worked shift',
            'current_employee_protocol': 'If the professional is previous employee, eligibility to return is determined using the HR database, Lawson.'
        },
        {
            'name': 'Froedtert Mequon Hospital',
            'region': 'Wisconsin',
            'health_system': 'Froedtert',
            'specialty': 'Tele RN',
            'recruiting': True,
            'onboarding': True,
            'required_experience': '1.5 years',
            'orientation_dates': 'Orientation Information',
            'facility_requirements': 'BLS only. Can be floated to ED to take care of holds',
            'dormancy_policy': '90 days after last worked shift',
            'current_employee_protocol': 'If the professional is previous employee, eligibility to return is determined using the HR database, Lawson.'
        },
        {
            'name': 'Froedtert Mequon Hospital',
            'region': 'Wisconsin',
            'health_system': 'Froedtert',
            'specialty': 'MedSurg RN',
            'recruiting': True,
            'onboarding': True,
            'required_experience': '1.5 years',
            'orientation_dates': 'Orientation Information',
            'facility_requirements': 'Rhythm strip documentation/interpretation not required',
            'dormancy_policy': '90 days after last worked shift',
            'current_employee_protocol': 'If the professional is previous employee, eligibility to return is determined using the HR database, Lawson.'
        },
        {
            'name': 'Froedtert Mequon Hospital',
            'region': 'Wisconsin',
            'health_system': 'Froedtert',
            'specialty': 'Hospital CNA',
            'recruiting': True,
            'onboarding': True,
            'required_experience': '1 year',
            'orientation_dates': 'Orientation Information',
            'facility_requirements': 'POCT- BG, obtain VS, daily weights, assist with hygiene and ADLs, transport, COP with restraints, & patient lifts.',
            'dormancy_policy': '90 days after last worked shift',
            'current_employee_protocol': 'If the professional is previous employee, eligibility to return is determined using the HR database, Lawson.'
        },
        {
            'name': 'Froedtert Mequon Hospital',
            'region': 'Wisconsin',
            'health_system': 'Froedtert',
            'specialty': 'ICU RN',
            'recruiting': True,
            'onboarding': True,
            'required_experience': '2 years',
            'orientation_dates': 'Orientation Information',
            'facility_requirements': 'ACLS, NIH. **Recent Epic experience required. **Ask if they have CVICU and/or TICU Strong ACLS skills, proficiency with central lines, ventilator management, titrating vasopressors to target vitals, neurologic checks, wound drains and EVDs, and cardiac monitoring.',
            'dormancy_policy': '90 days after last worked shift',
            'current_employee_protocol': 'If the professional is previous employee, eligibility to return is determined using the HR database, Lawson.'
        }
    ]

def upload_to_supabase(facilities):
    """Upload facilities to Supabase"""
    try:
        # Delete existing data to avoid duplicates
        supabase.table('facilities').delete().neq('id', 0).execute()
        print("✓ Cleared existing facilities")

        # Insert new data
        response = supabase.table('facilities').insert(facilities).execute()
        print(f"✓ Successfully uploaded {len(facilities)} facilities to Supabase!")
        return True
    except Exception as e:
        print(f"✗ Error uploading to Supabase: {e}")
        return False

def main():
    """Main function"""
    print("🚀 CareRev Facility Data Importer")
    print("=" * 50)

    # Get facility data
    facilities = manual_facility_data()

    print(f"📊 Loaded {len(facilities)} facilities")

    # Upload to Supabase
    if upload_to_supabase(facilities):
        print("\n✅ All facilities imported successfully!")
        print("🌐 Refresh your dashboard at http://localhost:3000")
    else:
        print("\n❌ Import failed. Check your Supabase connection.")

if __name__ == "__main__":
    main()
