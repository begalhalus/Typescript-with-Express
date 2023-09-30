class Message {
  static required = (str: string): string => {
    return `Maaf, Data ${str} tidak boleh kosong`
  }
  static notFound = (str: string): string => {
    return `Maaf, Data ${str} tidak ditemukan`
  }
  static existing = (str: string): string => {
    return `Maaf, Data ${str} sudah tersedia`
  }
}

export default Message
