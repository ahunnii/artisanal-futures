export const the_id_of_the_base_pattern = "base_pattern";
export const the_id_of_the_virtual_pattern = "virtual-pattern";

// NOTE:THIS IS FOR MALES
const bartol_meas_coefs: Array<[number, number, number]> = [
  [-0.00843030307, 0.00131652804, 0.447547912],
  [-0.120123132, 0.00236365418, 0.434361632],
  [0.193903283, 0.00139706978, 0.219167417],
  [-0.397436516, 0.00736043837, 1.09456939],
  [-0.287314058, 0.00742628431, 0.850773834],
  [0.010597377, 0.00414945566, 0.671920092],
  [0.0118373525, 0.000588985393, 0.103642264],
  [-0.137002408, 0.00245121599, 0.355032717],
  [-0.0214599125, 0.00124200087, 0.218721466],
  [0.336286377, -0.0000717186131, -0.063483009],
  [0.612709628, -0.000969801753, -0.254300726],
  [-0.0583795701, 0.00283900146, 0.474284018],
  [-0.0407932606, 0.00160870682, 0.30903314],
  [0.00520639762, 0.000828895423, 0.149071685],
  [-0.02324052, 0.00121216556, 0.313450831],
];

const bartol_labels = [
  "head_circumference",
  "neck_circumference",
  "shoulder_to_crotch",
  "chest_circumference",
  "waist_circumference",
  "pelvis_circumference",
  "wrist_circumference",
  "bicep_circumference",
  "forearm_circumference",
  "arm_length",
  "inside_leg_length",
  "thigh_circumference",
  "calf_circumference",
  "ankle_circumference",
  "shoulder_breadth",
];

export const bartol_et_al_measurements = (
  heightInMeters: number,
  weightInKg: number
) => {
  const measurements = bartol_meas_coefs.map(
    (coef: [number, number, number]) => {
      return heightInMeters * coef[0] + weightInKg * coef[1] + coef[2];
    }
  );

  const estimations = bartol_labels.reduce<Record<string, number>>(
    (obj, label, index) => {
      obj[label] = measurements[index]! * 100;
      return obj;
    },
    {}
  );

  estimations.height = heightInMeters * 100;
  estimations.weight = weightInKg;

  return estimations;
};

export const bartol_to_part = {
  "Shoulder to wrist (arm)": (meas: Record<string, number>) => {
    return meas.arm_length;
  }, // does that include the hand?
  biceps: (meas: Record<string, number>) => {
    return meas.bicep_circumference;
  },
  "Wrist width": (meas: Record<string, number>) => {
    return meas.wrist_circumference;
  },
};

export const checkBoxToPartId: Record<string, number> = {
  shoulder_to_wrist: 1,
  bicep: 2,
  wrist: 3,
};

export const checkboxStates = [
  "shoulderToWrist", // note to self, should really be using const varibale names; tracking this bug cost me 2 h :_(
  "bicep",
  "wrist",
  "ankle",
  "inseam",
  "knee",
  "seatBack",
];
export const setSelectedById = (
  array: Array<{ id: number; selected: boolean }>,
  id: number
) => {
  array.forEach((item) => {
    if (item.id === id) {
      item.selected = true;
      return;
    }
  });
};
