import images from "../../constants/images"
import Images from "../../constants/images"

export const vaccineList = [
    {
      "id": 1,
      "name": "BCG",
      "description": "Administered at birth to prevent tuberculosis.",
      "image": Images.BCG,
      "dueInWeeks": 0,
      "dueDate":"19/12/2024",
      "Time":"8.00am",
      "batchNo": "",
      "specialDetails": "Vaccinated by Dr.Kamal abeysekara",
      "status": "completed"
    },
    {
      "id": 2,
      "name": "Pentavalent (DTP, HepB, Hib) + OPV (1st Dose)",
      "description": "Combination vaccine to prevent diphtheria, tetanus, hepatitis B, and Haemophilus influenzae type B.",
      "image": images.Penta,
      "dueInWeeks": 8,
      "dueDate":"19/12/2024",
      "Time":"8.00am",
      "batchNo": "",
      "specialDetails": "Vaccinated by Dr.Kamal abeysekara",
      "status": "completed"
    },
    {
      "id": 3,
      "name": "Pentavalent (DTP, HepB, Hib) + OPV (2nd Dose)",
      "description": "Second dose of combination vaccine to prevent diphtheria, tetanus, hepatitis B, and Haemophilus influenzae type B.",
      "image": images.Penta,
      "dueInWeeks": 16,
      "dueDate":"19/12/2024",
      "Time":"8.00am",
      "batchNo": "",
      "specialDetails": "Vaccinated by Dr.Kamal abeysekara",
      "status": "completed"
    },
    {
      "id": 4,
      "name": "Pentavalent (DTP, HepB, Hib) + OPV (3rd Dose)",
      "description": "Third dose of combination vaccine to prevent diphtheria, tetanus, hepatitis B, and Haemophilus influenzae type B.",
      "image": images.Penta,
      "dueInWeeks": 24,
      "dueDate":"19/12/2024",
      "Time":"8.00am",
      "batchNo": "",
      "specialDetails": `Vaccinated by Dr.sunil perera.No any special notes`,
      "status": "completed"
    },
    {
      "id": 5,
      "name": "JE Vaccine",
      "description": "Prevents Japanese Encephalitis, given at 9 months.",
      "image": images.JE,
      "dueInWeeks": 39,
      "dueDate":"19/12/2024",
      "Time":"8.00am",
      "batchNo": "",
      "specialDetails": "",
      "status": "pending"
    },
    {
      "id": 6,
      "name": "MMR (1st Dose)",
      "description": "   CDC recommends that people get MMR vaccine to protect against measles, mumps, and rubella. Children should get two doses of MMR vaccine, starting with the first dose at 12 to 15 months of age.",
      "image": images.MMR,
      "dueInWeeks": 52,
      "dueDate":"19/12/2024",
      "Time":"8.00am",
      "batchNo": "",
      "specialDetails": "",
      "status": "pending"
    },
    {
      "id": 7,
      "name": "DTP + OPV ",
      "description": "Fourth dose of diphtheria, tetanus, and polio.",
      "image": images.OPV,
      "dueInWeeks": 78,
      "dueDate":"19/12/2024",
      "Time":"8.00am",
      "batchNo": "",
      "specialDetails": "",
      "status": "pending"
    },
    {
      "id": 8,
      "name": "MMR (2nd Dose)",
      "description": "Second dose to prevent measles, mumps, and rubella.",
      "image": images.MMR,
      "dueInWeeks": 156,
      "dueDate":"19/12/2024",
      "Time":"8.00am",
      "batchNo": "",
      "specialDetails": "",
      "status": "pending"
    },
    {
      "id": 9,
      "name": "DTP + OPV (Final Boost)",
      "description": "Final booster dose of diphtheria and polio, administered at 5 years.",
      "image": images.OPV,
      "dueInWeeks": 260,
      "dueDate":"19/12/2024",
      "Time":"8.00am",
      "batchNo": "",
      "specialDetails": "",
      "status": "pending"
    }
  ]
  