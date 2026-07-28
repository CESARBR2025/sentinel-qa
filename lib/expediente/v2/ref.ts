const PREFIX = 'exp2://'

export interface RefExpediente {
  folderPath: string
  uuid: string
}

export function serializarRef(ref: RefExpediente): string {
  return `${PREFIX}${ref.folderPath}#${ref.uuid}`
}

export function parsearRef(valor: string): RefExpediente | null {
  if (!valor.startsWith(PREFIX)) return null
  const sinPrefijo = valor.slice(PREFIX.length)
  const hashIdx = sinPrefijo.lastIndexOf('#')
  if (hashIdx === -1) return null
  return {
    folderPath: sinPrefijo.slice(0, hashIdx),
    uuid: sinPrefijo.slice(hashIdx + 1),
  }
}

export function esRefV2(valor: string): boolean {
  return valor.startsWith(PREFIX)
}

export function esVacio(valor: string | null | undefined): boolean {
  return !valor || valor === 'NO_DATA'
}
