import { z } from 'zod'

export const PostRolesSchema = z.object({
  body: z.object({
    name: z
      .string({
        required_error: 'Tidak boleh kosong'
      })
      .min(1, { message: 'Tidak boleh kosong' }),
    description: z
      .string({
        required_error: 'Tidak boleh kosong'
      })
      .min(1, { message: 'Tidak boleh kosong' })
  })
})

export const PutRolesSchema = z.object({
  params: z.object({
    id: z.string({
      required_error: 'Tidak boleh kosong'
    })
  }),
  body: z.object({
    name: z.string({
      required_error: 'Tidak boleh kosong'
    }),
    description: z
      .string({
        required_error: 'Tidak boleh kosong'
      })
      .min(1, { message: 'Tidak boleh kosong' })
  })
})

export const DetailRolesSchema = z.object({
  params: z.object({
    id: z.string({
      required_error: 'Tidak boleh kosong'
    })
  })
})

export const DeleteRolesSchema = z.object({
  params: z.object({
    id: z.string({
      required_error: 'Tidak boleh kosong'
    })
  })
})
