// Verified Sri Lankan crisis helplines (see NIMH / findahelpline.com)
export const CRISIS_HELPLINES = [
  { name: "National Mental Health Helpline (24/7)", number: "1926", note: "Free & confidential, call or SMS" },
  { name: "CCCline (CCC Foundation)", number: "1333", note: "24/7 free & confidential" },
  { name: "Sri Lanka Sumithrayo", number: "0707 308 308", note: "Emotional support" },
  { name: "Shanthi Maargam", number: "0717 639 898", note: "Youth support" },
  { name: "Suwaseriya Ambulance (medical emergency)", number: "1990", note: "Free ambulance service" },
];

// Non-diagnostic: maps a chosen concern to a SUGGESTED specialist type.
// This is guidance only, NOT a diagnosis.
export const SYMPTOM_TO_SPECIALIST: { concern: string; specialty: string }[] = [
  { concern: "Fever, general illness, diabetes, blood pressure", specialty: "Physician (Internal Medicine)" },
  { concern: "Chest pain, palpitations, heart concerns", specialty: "Cardiologist" },
  { concern: "Headaches, seizures, numbness, stroke signs", specialty: "Neurologist" },
  { concern: "Skin, hair, or nail problems", specialty: "Dermatologist" },
  { concern: "Bone, joint, fracture, or sports injury", specialty: "Orthopedic Surgeon" },
  { concern: "Ear, nose, or throat problems", specialty: "ENT Specialist" },
  { concern: "Eye problems or vision changes", specialty: "Ophthalmologist" },
  { concern: "Stomach, liver, or digestion issues", specialty: "Gastroenterologist" },
  { concern: "Breathing or lung problems", specialty: "Pulmonologist" },
  { concern: "Urinary problems", specialty: "Urologist" },
  { concern: "Kidney concerns", specialty: "Nephrologist" },
  { concern: "Children's health", specialty: "Pediatrician" },
  { concern: "Women's / reproductive health", specialty: "Gynecologist" },
  { concern: "Mental health, anxiety, depression, panic", specialty: "Psychiatrist" },
];
