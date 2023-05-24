import prisma, { type Doctor, type User } from '../../utils/database'
import { deleteUser, deleteUsers, findUserMany, findUserUnique } from '../user/user.services'

async function createDoctor (userId: string): Promise<Doctor> {
  const {
    birth, email, gender, height,
    weight, name, password, id, verified
  } = await findUserUnique('id', userId) as User
  await deleteUser(id)
  const doctorCreated = await prisma.doctor.create({
    data: {
      birth,
      email,
      gender,
      height,
      name,
      password,
      weight,
      verified
    }
  })
  return doctorCreated
}

async function createManyDoctors (userIds: string[]): Promise<Doctor[]> {
  const users = await findUserMany('id', userIds)
  const dataDoctor = users.map(user => {
    return {
      birth: user.birth,
      email: user.email,
      gender: user.gender,
      height: user.height,
      name: user.name,
      password: user.password,
      weight: user.weight
    }
  })
  const names = dataDoctor.map(doctor => doctor.name)
  await deleteUsers(userIds)
  await prisma.doctor.createMany({
    data: dataDoctor
  })
  const doctorsCreated = await findDoctorMany('email', names)
  return doctorsCreated
}

async function findDoctorUnique (
  uniqueIdentifier: 'email' | 'id',
  value: string
): Promise<Doctor | null> {
  let doctor: Doctor | null
  if (uniqueIdentifier === 'email') {
    doctor = await prisma.doctor.findUnique({
      where: { email: value }
    })
  } else {
    doctor = await prisma.doctor.findUnique({
      where: {
        id: value
      }
    })
  }
  return doctor
}

async function findDoctorMany (
  uniqueIdentifier: 'email' | 'id',
  values: string[]
): Promise<Doctor[]> {
  let doctors: Doctor[]
  if (uniqueIdentifier === 'email') {
    doctors = await prisma.doctor.findMany({
      where: {
        email: {
          in: values
        }
      }
    })
  } else {
    doctors = await prisma.doctor.findMany({
      where: {
        id: {
          in: values
        }
      }
    })
  }
  return doctors
}

export {
  createDoctor,
  createManyDoctors,
  findDoctorUnique,
  findDoctorMany
}
