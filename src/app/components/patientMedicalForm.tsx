'use client';
import React from 'react';
import { Dispatch, SetStateAction } from 'react';
import type { Patient } from '@/app/types/patient.ts';

interface PatientMedicalFormProps {
  patient: Patient;
  setPatient: Dispatch<SetStateAction<Patient | null>>;
  handleSubmit: () => void;
}

const PatientMedicalForm: React.FC<PatientMedicalFormProps> = ({
  patient,
  setPatient,
  handleSubmit,
}) => {
  return (
    <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
      {/* Personal Information */}
      <section className="flex flex-col mb-6">
        <h3 className="text-xl font-semibold">Personal Information</h3>
        <div className="min-h-1 bg-[#3ca444]"></div>
      </section>

      <div className="grid grid-cols-2 gap-12">
        {/* LEFT */}
        <div className="flex flex-col gap-4">
          <LabeledInput label="First Name" value={patient.first_name} onChange={(val) => setPatient(prev => ({ ...prev!, first_name: val }))} />
          <LabeledInput label="Date of Birth" type="date" value={patient.date_of_birth} onChange={(val) => setPatient(prev => ({ ...prev!, date_of_birth: val }))} />
          <LabeledSelect label="Sex" value={patient.sex} onChange={(val) => setPatient(prev => ({ ...prev!, sex: val }))} options={['Male', 'Female']} />
          <LabeledInput label="Race" value={patient.race} onChange={(val) => setPatient(prev => ({ ...prev!, race: val }))} />
        </div>

        {/* RIGHT */}
        <div className="flex flex-col gap-4">
          <LabeledInput label="Last Name" value={patient.last_name} onChange={(val) => setPatient(prev => ({ ...prev!, last_name: val }))} />
          <LabeledInput label="Age" value={patient.age} onChange={(val) => setPatient(prev => ({ ...prev!, age: val }))} />
          <LabeledInput label="Offspring" value={patient.offspring} onChange={(val) => setPatient(prev => ({ ...prev!, offspring: val }))} />
          <LabeledSelect label="Nationality" value={patient.nationality} onChange={(val) => setPatient(prev => ({ ...prev!, nationality: val }))} options={['Jamaican', 'Other']} />
        </div>
      </div>

      {/* Biometrics Section */}
      <section className="flex flex-col mb-6 mt-12">
        <h3 className="text-xl font-semibold">Biometrics and Physical Data</h3>
        <div className="min-h-1 bg-[#3ca444]"></div>
      </section>

      <div className="grid grid-cols-2 gap-12">
        {/* LEFT */}
        <div className="flex flex-col gap-4">
          <LabeledInput label="Height" value={patient.height} onChange={(val) => setPatient(prev => ({ ...prev!, height: val }))} />
          <LabeledInput label="B.M.I." value={patient.bmi} onChange={(val) => setPatient(prev => ({ ...prev!, bmi: val }))} />
          <LabeledInput label="Blood Type" value={patient.blood_type} onChange={(val) => setPatient(prev => ({ ...prev!, blood_type: val }))} />
        </div>

        {/* RIGHT */}
        <div className="flex flex-col gap-4">
          <LabeledInput label="Weight" value={patient.weight} onChange={(val) => setPatient(prev => ({ ...prev!, weight: val }))} />
          <LabeledInput label="Blood Pressure" value={patient.blood_pressure} onChange={(val) => setPatient(prev => ({ ...prev!, blood_pressure: val }))} />
          <LabeledInput label="Resting Heart Rate" value={patient.resting_heart_rate} onChange={(val) => setPatient(prev => ({ ...prev!, resting_heart_rate: val }))} />
        </div>
      </div>

      <button
        className="flex items-center p-3 gap-2 bg-[#008044] text-white rounded-sm mt-12"
        type="submit"
      >
        Update Records
      </button>
    </form>
  );
};

export default PatientMedicalForm;

// Reusable Components
const LabeledInput = ({
  label,
  value,
  onChange,
  type = 'text',
}: {
  label: string;
  value?: string;
  onChange: (value: string) => void;
  type?: string;
}) => (
  <div className="flex flex-col">
    <label className="text-sm">{label}</label>
    <input
      className="text-xl font-semibold"
      type={type}
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

const LabeledSelect = ({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value?: string;
  onChange: (value: string) => void;
  options: string[];
}) => (
  <div className="flex flex-col">
    <label className="text-sm">{label}</label>
    <select
      className="text-xl font-semibold"
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">Select {label}</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </div>
);
