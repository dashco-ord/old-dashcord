import { Subjects } from "@prisma/client";

export const semSwitch = (sem: number) => {
  let subject1, subject2;
  switch (sem) {
    case 1:
      subject1 = Subjects.AI;
      subject2 = Subjects.CN;
      break;
    default:
      subject1 = null;
  }
  return {
    subjects: {
      subject1,
      subject2,
    },
  };
};
