'use client'

import supabase from '@/app/lib/supabaseClient'
import { useState } from 'react'

export default function DashboardMainContent() {

    //FORM INPUT STATE
    const [emailValue, setemailValue] = useState('');
    const [fNameValue, setfNameValue] = useState('');
    const [lNameValue, setlNameValue] = useState('');
    const [dobValue, setdobValue] = useState('');
    const [genderValue, setgenderValue] = useState('');
    const [addressValue, setaddressValue] = useState('');
    const [emergencyNameValue, setemergencyNameValue] = useState('');
    const [emergencyRelValue, setemergencyRelValue] = useState('');
    const [emergencyPhoneValue, setemergencyPhoneValue] = useState('');
    const [medConditionsValue, setmedConditionsValue] = useState('');
    const [allergiesValue, setallergiesValue] = useState('');
    const [currentmedsValue, setcurrentmedsValue] = useState('');
    const [surgeriesValue, setsurgeriesValue] = useState('');
    const [insuranceProviderValue, setinsuranceProviderValue] = useState('');
    const [insurancePolNumValue, setinsurancePolNumValue] = useState('');
    const [insuranceGrpNumValue, setinsuranceGrpNumValue] = useState('');
    const [drinkingValue, setdrinkingValue] = useState('');
    const [smokingValue, setsmokingValue] = useState('');
    const [exerciseValue, setexerciseValue] = useState('');
    const [dietRestrictionValue, setdietRestrictionValue] = useState('');
    const [famHistoryValue, setfamHistoryValue] = useState('');
    const [heightValue, setheightValue] = useState('');
    const [weightValue, setweightValue] = useState('');

    //SECTION SWITCHING FUNCTIONALITY
    const [activeSection, setActiveSection] = useState<
        'overview' | 'appointments' | 'prescriptions' | 'reports' | 'profile' | 'settings'
      >('overview');

    //SEND DATA TO DATABASE
    const MovetoDB = async () => {
    
        const { data: PatientProfileData, error: PatientProfileError } = await supabase
          .from('patients')
          .upsert([{
            first_name: fNameValue || null,
            last_name: lNameValue || null,
            date_of_birth: dobValue || null,
            gender: genderValue || null,
            address: addressValue || null,
            emergency_name: emergencyNameValue || null,
            emergency_relation: emergencyRelValue || null,
            emergency_phone: emergencyPhoneValue || null,
            medical_conditions: medConditionsValue || null,
            allergies: allergiesValue || null,
            current_medications: currentmedsValue || null,
            surgeries: surgeriesValue || null,
            insurance_provider: insuranceProviderValue || null,
            insurance_policy_number: insurancePolNumValue || null,
            insurance_group_number: insuranceGrpNumValue || null,
            drinking_frequency: drinkingValue || null,
            smoking_frequency: smokingValue || null,
            exercise_frequency: exerciseValue || null,
            diet_restrictions: dietRestrictionValue || null,
            family_history: famHistoryValue || null
          }])
          if (PatientProfileData) {
            console.error('❌ Error updating patients table:', PatientProfileError)
          } else {
            console.error('Error inserting data:', PatientProfileError);
          }
          
          const { error: emailUpdateError } = await supabase.auth.updateUser({
              email: emailValue || undefined
            })
    
            if (emailUpdateError) {
              console.error('❌ Error updating auth.users email:', emailUpdateError)
            } else {
              alert('Email Data updated')
            }
    };
    return (
        <div className="md:col-span-5">
            {activeSection === 'overview' && (
            <div className="space-y-6">
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="p-6">
                        <h2 className="text-xl font-semibold text-slate-800 mb-4">Welcome, <span id="welcomeName"></span>.</h2>
        
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-2 mb-6'>
                            <div className='flex flex-col gap-4'>
                                <div className='flex flex-col'>
                                  <p className="text-slate-600">Date of Birth</p><span id="dobOverview"></span>
                                </div>
                                <div className='flex flex-col'>
                                  <p className="text-slate-600">Gender:</p><span id="genOverview"></span>
                                </div>
                            </div>
                            <div className='flex flex-col gap-4'>
                                <div className='flex flex-col'>
                                  <p className="text-slate-600">Height</p><span id="heightOverview"></span>
                                </div>
                                <div className='flex flex-col'>
                                  <p className="text-slate-600">Weight</p><span id="weightOverview"></span>
                                </div>
                            </div>
                        </div>
        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-blue-50  rounded-lg p-6">
                                <div className="flex items-center">
                                    <div className="bg-green-100 rounded-full p-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 1.79-3 4s1.343 4 3 4 3-1.79 3-4-1.343-4-3-4zm0 12c-4.418 0-8-3.582-8-8s3.582-8 8-8c1.48 0 2.865.403 4.034 1.102a.998.998 0 01.15 1.55l-2.017 2.018A5.978 5.978 0 0012 8c-3.314 0-6 2.686-6 6s2.686 6 6 6z" />
                                        </svg>
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="text-sm font-medium text-slate-500">Heart Rate</h3>
                                        <p id="BPM" className="text-2xl font-semibold text-slate-800"></p>
                                    </div>
                                </div>
                            </div>
        
                            <div className="bg-blue-50  rounded-lg p-6">
                                <div className="flex items-center">
                                    <div className="bg-green-100 rounded-full p-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m0-4h.01M12 20h.01M16 12a4 4 0 00-8 0v4a4 4 0 008 0v-4z" />
                                        </svg>
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="text-sm font-medium text-slate-500">Blood Pressure</h3>
                                        <p className="text-2xl font-semibold text-slate-800"></p>
                                    </div>
                                </div>
                            </div>
        
                            <div className="bg-blue-50  rounded-lg p-6">
                                <div className="flex items-center">
                                    <div className="bg-green-100 rounded-full p-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c1.657 0 3-1.343 3-3S13.657 5 12 5 9 6.343 9 8s1.343 3 3 3zm0 2c-2.667 0-8 1.333-8 4v1h16v-1c0-2.667-5.333-4-8-4z" />
                                        </svg>
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="text-sm font-medium text-slate-500">BMI</h3>
                                        <p className="text-2xl font-semibold text-slate-800"></p>
                                    </div>
                                </div>
                            </div>
        
                            <div className="bg-blue-50  rounded-lg p-6">
                                <div className="flex items-center">
                                    <div className="bg-green-100 rounded-full p-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c1.657 0 3-1.343 3-3S13.657 5 12 5 9 6.343 9 8s1.343 3 3 3zm0 2c-2.667 0-8 1.333-8 4v1h16v-1c0-2.667-5.333-4-8-4z" />
                                        </svg>
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="text-sm font-medium text-slate-500">Blood Glucose Level (mg/dL or mmol/L)</h3>
                                        <p className="text-2xl font-semibold text-slate-800"></p>
                                    </div>
                                </div>
                            </div>
        
                            <div className="bg-blue-50  rounded-lg p-6">
                                <div className="flex items-center">
                                    <div className="bg-green-100 rounded-full p-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c1.657 0 3-1.343 3-3S13.657 5 12 5 9 6.343 9 8s1.343 3 3 3zm0 2c-2.667 0-8 1.333-8 4v1h16v-1c0-2.667-5.333-4-8-4z" />
                                        </svg>
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="text-sm font-medium text-slate-500">Oxygen Saturation (SpO₂ %) </h3>
                                        <p className="text-2xl font-semibold text-slate-800"></p>
                                    </div>    
                                </div>
                            </div>
        
                            <div className="bg-blue-50  rounded-lg p-6">
                                <div className="flex items-center">
                                    <div className="bg-green-100 rounded-full p-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c1.657 0 3-1.343 3-3S13.657 5 12 5 9 6.343 9 8s1.343 3 3 3zm0 2c-2.667 0-8 1.333-8 4v1h16v-1c0-2.667-5.333-4-8-4z" />
                                        </svg>
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="text-sm font-medium text-slate-500">Cholesterol Level (Total/LDL/HDL)</h3>
                                        <p className="text-2xl font-semibold text-slate-800"></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="p-6">
                        <h3 className="text-lg font-medium text-slate-800 mb-4">Additional Biometrics</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-700">
                            <div className="p-4 border border-slate-200 rounded-lg">Respiration Rate: <span className="font-semibold"> breaths/min</span></div>
                            <div className="p-4 border border-slate-200 rounded-lg">Height: <span className="font-semibold"></span></div>
                            <div className="p-4 border border-slate-200 rounded-lg">Body Temperature: <span className="font-semibold"> °F</span></div>
                            <div className="p-4 border border-slate-200 rounded-lg">Weight: <span className="font-semibold"> kg</span></div>
                        </div>
                    </div>
                </div>
            </div>
        )}
        
        {activeSection === 'appointments' && (
            <div className="space-y-6">
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold text-slate-800">My Appointments</h2>
                            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-700 hover:bg-blue-800">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Schedule New Appointment
                            </button>
                        </div>
        
                        <div className="bg-slate-50 rounded-lg p-4 mb-6">
                            <div className="flex items-center">
                                <div className="bg-blue-100 rounded-full p-2 mr-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <p className="text-slate-700">
                                  You can schedule appointments with specialists directly through the portal or call our reception at (555) 123-4567.
                                </p>
                            </div>
                        </div>
        
                        <div className="mb-6">
                            <div className="flex space-x-2 mb-4">
                                <button className="px-3 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-800">
                                  All
                                </button>
                                <button className="px-3 py-1 text-sm font-medium rounded-full text-slate-600 hover:bg-slate-100">
                                  Upcoming
                                </button>
                                <button className="px-3 py-1 text-sm font-medium rounded-full text-slate-600 hover:bg-slate-100">
                                  Past
                                </button>
                                <button className="px-3 py-1 text-sm font-medium rounded-full text-slate-600 hover:bg-slate-100">
                                  Cancelled
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )}
        
        {activeSection === 'prescriptions' && (
            <p>Placeholder text</p>
        )}
        
        {activeSection === 'reports' && (
            <p>Placeholder text</p>
        )}
        
        
        {activeSection === 'profile' && (
            <div className="space-y-6 text-black">
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="p-6">
                        <h2 className="text-xl font-semibold text-slate-800 mb-6">My Health Profile</h2>
        
                        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6">
                            <div className="flex items-center">
                                <div className="bg-blue-100 rounded-full p-2 mr-4">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                </div>
                                <p className="text-slate-700">
                                  Completing your health profile helps your doctors provide better care. All information is kept confidential and secure.
                                </p>
                            </div>
                        </div>
        
                        <form className="space-y-6">
                            <div>
                                <h3 className="text-lg font-medium text-slate-800 mb-4">Personal Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                                        Email
                                        </label>
                                        <input
                                        type="text"
                                        id="email"
                                        name="email"
                                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        value={emailValue}
                                        onChange={(e) => setemailValue(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="fullName" className="block text-sm font-medium text-slate-700 mb-1">
                                        First Name
                                        </label>
                                        <input
                                        type="text"
                                        id="firstName"
                                        name="firstName"
                                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        value={fNameValue}
                                        onChange={(e) => setfNameValue(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="fullName" className="block text-sm font-medium text-slate-700 mb-1">
                                        Last Name
                                        </label>
                                        <input
                                        type="text"
                                        id="lastName"
                                        name="lastName"
                                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        value={lNameValue}
                                        onChange={(e) => setlNameValue(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="dateOfBirth" className="block text-sm font-medium text-slate-700 mb-1">
                                        Date of Birth
                                        </label>
                                        <input
                                        type="date"
                                        id="dateOfBirth"
                                        name="dateOfBirth"
                                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        value={dobValue}
                                        onChange={(e) => setdobValue(e.target.value)}
                                        placeholder="mm/dd/yyyy"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="gender" className="block text-sm font-medium text-slate-700 mb-1">
                                        Gender
                                        </label>
                                        <select
                                        id="gender"
                                        name="gender"
                                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        value={genderValue}
                                        onChange={(e) => setgenderValue(e.target.value)}
                                        >
                                        <option value="">Select Gender</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label htmlFor="height" className="block text-sm font-medium text-slate-700 mb-1">
                                        Height
                                        </label>
                                        <input
                                        type="text"
                                        id="height"
                                        name="height"
                                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        value={heightValue}
                                        onChange={(e) => setheightValue(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="height" className="block text-sm font-medium text-slate-700 mb-1">
                                        Height
                                        </label>
                                        <input
                                        type="text"
                                        id="weight"
                                        name="weight"
                                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        value={weightValue}
                                        onChange={(e) => setweightValue(e.target.value)}
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label htmlFor="address" className="block text-sm font-medium text-slate-700 mb-1">
                                        Address
                                        </label>
                                        <textarea
                                        id="address"
                                        name="address"
                                        rows={3}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        value={addressValue}
                                        onChange={(e) => setaddressValue(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
        
                            <div>
                                <h3 className="text-lg font-medium text-slate-800 mb-4">Emergency Contact</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <label htmlFor="emergencyName" className="block text-sm font-medium text-slate-700 mb-1">
                                        Contact Name
                                        </label>
                                        <input
                                        type="text"
                                        id="emergencyName"
                                        name="emergencyName"
                                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        value={emergencyNameValue}
                                        onChange={(e) => setemergencyNameValue(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="emergencyRelationship" className="block text-sm font-medium text-slate-700 mb-1">
                                        Relationship
                                        </label>
                                        <input
                                        type="text"
                                        id="emergencyRelationship"
                                        name="emergencyRelationship"
                                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        value={emergencyRelValue}
                                        onChange={(e) => setemergencyRelValue(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="emergencyPhone" className="block text-sm font-medium text-slate-700 mb-1">
                                        Phone Number
                                        </label>
                                        <input
                                        type="tel"
                                        id="emergencyPhone"
                                        name="emergencyPhone"
                                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        value={emergencyPhoneValue}
                                        onChange={(e) => setemergencyPhoneValue(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
        
                              <div>
                                <h3 className="text-lg font-medium text-slate-800 mb-4">Medical History</h3>
                                <div className="grid grid-cols-1 gap-6">
                                  <div>
                                    <label htmlFor="conditions" className="block text-sm font-medium text-slate-700 mb-1">
                                      Medical Conditions
                                    </label>
                                    <textarea
                                      id="conditions"
                                      name="conditions"
                                      rows={2}
                                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                      placeholder="List any chronic conditions, diseases, or medical problems"
                                      value={medConditionsValue}
                                      onChange={(e) => setmedConditionsValue(e.target.value)}
                                    />
                                  </div>
                                  <div>
                                    <label htmlFor="allergies" className="block text-sm font-medium text-slate-700 mb-1">
                                      Allergies
                                    </label>
                                    <textarea
                                      id="allergies"
                                      name="allergies"
                                      rows={2}
                                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                      placeholder="List any allergies to medications, foods, or other substances"
                                      value={allergiesValue}
                                      onChange={(e) => setallergiesValue(e.target.value)}
                                    />
                                  </div>
                                  <div>
                                    <label htmlFor="medications" className="block text-sm font-medium text-slate-700 mb-1">
                                      Current Medications
                                    </label>
                                    <textarea
                                      id="medications"
                                      name="medications"
                                      rows={2}
                                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                      placeholder="List all medications you are currently taking"
                                      value={currentmedsValue}
                                      onChange={(e) => setcurrentmedsValue(e.target.value)}
                                    />
                                  </div>
                                  <div>
                                    <label htmlFor="surgeries" className="block text-sm font-medium text-slate-700 mb-1">
                                      Past Surgeries/Hospitalizations
                                    </label>
                                    <textarea
                                      id="surgeries"
                                      name="surgeries"
                                      rows={2}
                                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                      placeholder="List any surgeries or hospital stays with approximate dates"
                                      value={surgeriesValue}
                                      onChange={(e) => setsurgeriesValue(e.target.value)}
                                    />
                                  </div>
                                </div>
                              </div>
        
                              <div>
                                <h3 className="text-lg font-medium text-slate-800 mb-4">Insurance Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                  <div>
                                    <label htmlFor="insuranceProvider" className="block text-sm font-medium text-slate-700 mb-1">
                                      Insurance Provider
                                    </label>
                                    <input
                                      type="text"
                                      id="insuranceProvider"
                                      name="insuranceProvider"
                                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                      value={insuranceProviderValue}
                                      onChange={(e) => setinsuranceProviderValue(e.target.value)}
                                    />
                                  </div>
                                  <div>
                                    <label htmlFor="policyNumber" className="block text-sm font-medium text-slate-700 mb-1">
                                      Policy Number
                                    </label>
                                    <input
                                      type="text"
                                      id="policyNumber"
                                      name="policyNumber"
                                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                      value={insurancePolNumValue}
                                      onChange={(e) => setinsurancePolNumValue(e.target.value)}
                                    />
                                  </div>
                                  <div>
                                    <label htmlFor="groupNumber" className="block text-sm font-medium text-slate-700 mb-1">
                                      Group Number
                                    </label>
                                    <input
                                      type="text"
                                      id="groupNumber"
                                      name="groupNumber"
                                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                      value={insuranceGrpNumValue}
                                      onChange={(e) => setinsuranceGrpNumValue(e.target.value)}
                                    />
                                  </div>
                                </div>
                              </div>
        
                              <div>
                                <h3 className="text-lg font-medium text-slate-800 mb-4">Lifestyle Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <div>
                                    <label htmlFor="smokingFrequency" className="block text-sm font-medium text-slate-700 mb-1">
                                      Smoking Frequency
                                    </label>
                                    <select
                                      id="smokingFrequency"
                                      name="smokingFrequency"
                                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                      value={smokingValue}
                                      onChange={(e) => setsmokingValue(e.target.value)}
                                    >
                                      <option value="">Select Frequency</option>
                                      <option value="none">None</option>
                                      <option value="occasional">Occasional</option>
                                      <option value="moderate">Moderate</option>
                                      <option value="heavy">Heavy</option>
                                    </select>
                                  </div>
                                  <div>
                                    <label htmlFor="alcoholFrequency" className="block text-sm font-medium text-slate-700 mb-1">
                                      Alcohol Frequency
                                    </label>
                                    <select
                                      id="alcoholFrequency"
                                      name="alcoholFrequency"
                                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                      value={drinkingValue}
                                      onChange={(e) => setdrinkingValue(e.target.value)}
                                    >
                                      <option value="">Select Frequency</option>
                                      <option value="none">None</option>
                                      <option value="occasional">Occasional</option>
                                      <option value="moderate">Moderate</option>
                                      <option value="heavy">Heavy</option>
                                    </select>
                                  </div>
                                  <div>
                                    <label htmlFor="exerciseFrequency" className="block text-sm font-medium text-slate-700 mb-1">
                                      Exercise Frequency
                                    </label>
                                    <select
                                      id="exerciseFrequency"
                                      name="exerciseFrequency"
                                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                      value={exerciseValue}
                                      onChange={(e) => setexerciseValue(e.target.value)}
                                    >
                                      <option value="">Select Frequency</option>
                                      <option value="sedentary">Sedentary</option>
                                      <option value="light">Light (1-2 days/week)</option>
                                      <option value="moderate">Moderate (3-4 days/week)</option>
                                      <option value="active">Active (5+ days/week)</option>
                                    </select>
                                  </div>
                                  <div>
                                    <label htmlFor="dietaryRestrictions" className="block text-sm font-medium text-slate-700 mb-1">
                                      Dietary Restrictions
                                    </label>
                                    <input
                                      type="text"
                                      id="dietaryRestrictions"
                                      name="dietaryRestrictions"
                                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                      placeholder="E.g., vegetarian, gluten-free, etc."
                                      value={dietRestrictionValue}
                                      onChange={(e) => setdietRestrictionValue(e.target.value)}
                                    />
                                  </div>
                                </div>
                              </div>
        
                              <div>
                                <h3 className="text-lg font-medium text-slate-800 mb-4">Family Medical History</h3>
                                <div className="grid grid-cols-1 gap-6">
                                  <div>
                                    <label htmlFor="familyHistory" className="block text-sm font-medium text-slate-700 mb-1">
                                      Significant Family Medical Conditions
                                    </label>
                                    <textarea
                                      id="familyHistory"
                                      name="familyHistory"
                                      rows={3}
                                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                      placeholder="List any significant medical conditions in your immediate family (parents, siblings, children)"
                                      value={famHistoryValue}
                                      onChange={(e) => setfamHistoryValue(e.target.value)}
                                    />
                                  </div>
                                </div>
                              </div>
        
                              <div className="flex justify-end pt-4">
                                <button
                                  type="button"
                                  onClick={MovetoDB}
                                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                  Save Profile
                                </button>
                              </div>
                            </form>
                          </div>
                        </div>
                      </div>
                    )}
        
        
                    {activeSection === 'settings' && (
                      <p>Coming Soon!</p>
                    )}
                  </div>
    )
}