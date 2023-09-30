import { z } from 'zod'

export const PostLoginSchema = z.object({
  body: z.object({
    username: z
      .string({
        required_error: 'Tidak boleh kosong'
      })
      .min(1, { message: 'Tidak boleh kosong' }),
    password: z
      .string({
        required_error: 'Tidak boleh kosong'
      })
      .min(1, { message: 'Tidak boleh kosong' })
  })
})

export const PostUsersSchema = z.object({
  body: z.object({
    name: z
      .string({
        required_error: 'Tidak boleh kosong'
      })
      .min(1, { message: 'Tidak boleh kosong' }),
    password: z
      .string({
        required_error: 'Tidak boleh kosong'
      })
      .min(1, { message: 'Tidak boleh kosong' }),
    username: z
      .string({
        required_error: 'Tidak boleh kosong'
      })
      .min(1, { message: 'Tidak boleh kosong' })
  })
})

export const PutUsersSchema = z.object({
  params: z.object({
    id: z.string({
      required_error: 'Tidak boleh kosong'
    })
  }),
  body: z.object({
    role_id: z
      .string({
        required_error: 'Tidak boleh kosong'
      })
      .min(1, { message: 'Tidak boleh kosong' }),
    name: z
      .string({
        required_error: 'Tidak boleh kosong'
      })
      .min(1, { message: 'Tidak boleh kosong' }),
    password: z
      .string({
        required_error: 'Tidak boleh kosong'
      })
      .min(1, { message: 'Tidak boleh kosong' }),
    username: z
      .string({
        required_error: 'Tidak boleh kosong'
      })
      .min(1, { message: 'Tidak boleh kosong' })
  })
})

export const DetailUsersSchema = z.object({
  params: z.object({
    id: z.string({
      required_error: 'Tidak boleh kosong'
    })
  })
})

export const DeleteUsersSchema = z.object({
  params: z.object({
    id: z.string({
      required_error: 'Tidak boleh kosong'
    })
  })
})
