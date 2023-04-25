import { z } from 'zod'

const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])([A-Za-z\d$@$!%*?&]|[^ ]){8,15}$/
const regexObjectId = /^[a-fA-F0-9]{24}$/

const GENDER = ['MASCULINE', 'FEMININE', 'NEUTER'] as const
const ROLES = ['ADMIN', 'USER'] as const

const userCore = {
  age: z.number({
    required_error: 'Age is required',
    invalid_type_error: 'Age must be an integer'
  }).int().nonnegative().lte(150, {
    message: 'Age must be an integer between 0 and 150'
  }),
  gender: z.enum(GENDER, {
    required_error: 'gender is required',
    invalid_type_error: "Gender must be 'MASCULINE', 'FEMININE' or 'NEUTER'"
  }),
  height: z.number({
    required_error: 'Height is required',
    invalid_type_error: 'Height must be a number'
  }).nonnegative().lte(3, { message: 'Height must be a number between 0 - 3' }),
  weight: z.number({
    required_error: 'Weight is required',
    invalid_type_error: 'Weight must be a number'
  }).nonnegative().lte(600, { message: 'Weight must be a number between 0 - 600' }),
  chronicDisorders: z.array(z.string().trim(), {
    required_error: 'ChronicDisorders is required',
    invalid_type_error: 'ChronicDisorders must be an array of strings'
  }),
  BMI: z.number({
    required_error: 'BMI is required'
  }).nonnegative()
}

const sessionCore = {
  valid: z.boolean({
    required_error: 'Valid is required',
    invalid_type_error: 'Valid must be a boolean'
  }),
  userId: z.string({
    required_error: 'UserId is required',
    invalid_type_error: 'UserId must be a string'
  }).regex(regexObjectId)
}

const userExtent = {
  email: z.string({
    required_error: 'Email is required',
    invalid_type_error: 'Email must be a string'
  }).email({
    message: 'Invalid email address'
  }),
  password: z.string({
    required_error: 'Password is required',
    invalid_type_error: 'Password must be a string'
  }).regex(regexPassword),
  role: z.enum(ROLES, {
    required_error: 'Role is required'
  }).default('USER'),
  verificationCode: z.string({
    required_error: 'VerificationCode is required',
    invalid_type_error: 'VerificationCode must be a string'
  }).uuid(),
  id: z.string({
    required_error: 'Id is required',
    invalid_type_error: 'Id must be a valid MongoDb ObjectId'
  }).regex(regexObjectId),
  profilePicture: z.string({
    required_error: 'ProfilePicture is required',
    invalid_type_error: 'ProfilePicture must be a string'
  }).trim(),
  passwordResetCode: z.number({
    required_error: 'PasswordResetCode is required',
    invalid_type_error: 'PasswordResetCode must be an integer within a range'
  })
}

const {
  email,
  password,
  id,
  verificationCode,
  role,
  profilePicture,
  passwordResetCode
} = userExtent

const { BMI, ...userCoreExceptBMI } = userCore

const { gender } = userCore

const createUserSchema = z.object({
  ...userCoreExceptBMI,
  email,
  password
})

const createUserResponseSchema = z.object({
  ...userCore,
  email,
  id
})

const createUserResponseHandlerSchema = z.object({
  ...userCore,
  email,
  id,
  verificationCode
})

const logInUserSchema = z.object({
  email,
  password: z.string({
    required_error: 'Password is required',
    invalid_type_error: 'Password must be a string'
  })
    .trim()
    .min(8, {
      message: 'Minimum length is 8 characters'
    }).max(15, {
      message: 'Maximum length is 15 characters'
    })
})

const logInUserResponseSchema = z.object({
  accessToken: z.string({
    required_error: 'AccessToken is required',
    invalid_type_error: 'AccessToken must be a string'
  }).trim(),
  refreshToken: z.string({
    required_error: 'RefreshToken is required',
    invalid_type_error: 'RefreshToken must be a string'
  }).trim()
})

const refreshTokenResponseSchema = logInUserResponseSchema.pick({ accessToken: true })

const refreshTokenHeaderSchema = z.object({
  refresh: z.string({
    required_error: 'RefreshToken is required',
    invalid_type_error: 'RefreshToken must be a string'
  }).trim()
})

const findUserSchema = z.object({
  id
})

const verifyAccountParamsSchema = z.object({
  id,
  verificationCode
})

const resetPasswordParamsSchema = z.object({
  id,
  passwordResetCode
})

const resetPasswordBodySchema = z.object({
  password
})

const updateUserSchema = z.object({
  age: z.optional(userCoreExceptBMI.age),
  gender: z.optional(userCoreExceptBMI.gender),
  height: z.optional(userCoreExceptBMI.height),
  weight: z.optional(userCoreExceptBMI.weight),
  chronicDisorders: z.optional(userCoreExceptBMI.chronicDisorders),
  BMI: z.optional(BMI),
  verified: z.optional(z.boolean()),
  passwordResetCode: z.optional(passwordResetCode.or(z.null())),
  password: z.optional(password),
  profilePicture: z.optional(profilePicture)
})

const verifyAccountResponseSchema = z.object({
  message: z.string({
    required_error: 'Message is required',
    invalid_type_error: 'Message must be a string'
  })
})

const verificationErrorResponseSchema = z.object({
  message: z.string({
    required_error: 'Message is required',
    invalid_type_error: 'Message must be a string'
  })
})

const updateSessionSchema = z.object({
  valid: z.optional(sessionCore.valid),
  userId: z.optional(sessionCore.userId)
})

const forgotPasswordSchema = z.object({
  email
})

type CreateUserInput = z.infer<typeof createUserSchema>
type CreateUserResponse = z.infer<typeof createUserResponseSchema>
type CreateUserResponseHandler = z.infer<typeof createUserResponseHandlerSchema>
type LogInUserInput = z.infer<typeof logInUserSchema>
type LogInUserResponse = z.infer<typeof logInUserResponseSchema>
type FindUserInput = z.infer<typeof findUserSchema>
type VerifyAccountParamsInput = z.infer<typeof verifyAccountParamsSchema>
type UpdateUserInput = z.infer<typeof updateUserSchema>
type VerifyAccountResponse = z.infer<typeof verifyAccountResponseSchema>
type UpdateSessionInput = z.infer<typeof updateSessionSchema>
type VerificationErrorResponse = z.infer<typeof verificationErrorResponseSchema>
type RefreshTokenHeaderInput = z.infer<typeof refreshTokenHeaderSchema>
type RefreshTokenResponse = z.infer<typeof refreshTokenResponseSchema>
type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>
type ResetPasswordParamsInput = z.infer<typeof resetPasswordParamsSchema>
type ResetPasswordBodyInput = z.infer<typeof resetPasswordBodySchema>
type Gender = z.infer<typeof gender>
type Role = z.infer<typeof role>

export {
  type Gender,
  type Role,
  createUserSchema,
  createUserResponseSchema,
  createUserResponseHandlerSchema,
  logInUserSchema,
  logInUserResponseSchema,
  findUserSchema,
  verifyAccountParamsSchema,
  verifyAccountResponseSchema,
  updateUserSchema,
  verificationErrorResponseSchema,
  refreshTokenHeaderSchema,
  refreshTokenResponseSchema,
  forgotPasswordSchema,
  resetPasswordParamsSchema,
  resetPasswordBodySchema,
  type ResetPasswordBodyInput,
  type ResetPasswordParamsInput,
  type CreateUserResponse,
  type CreateUserInput,
  type CreateUserResponseHandler,
  type LogInUserInput,
  type LogInUserResponse,
  type FindUserInput,
  type VerifyAccountParamsInput,
  type VerifyAccountResponse,
  type UpdateUserInput,
  type UpdateSessionInput,
  type VerificationErrorResponse,
  type RefreshTokenHeaderInput,
  type RefreshTokenResponse,
  type ForgotPasswordInput
}
