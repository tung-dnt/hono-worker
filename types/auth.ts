export enum AuthAction {
  ALL = '*',
  GET = 'get',
  UPDATE = 'update',
  CREATE = 'create',
  DELETE = 'delete',
}

export enum UserStatus {
  ACTIVE = 1,
  DELETED = 0,
}

export type ClientResource = 'seo-optimizer' | 'renderer' | 'image-optimizer'

export type SystemResource = 'user' | 'bill'

export type PolicyPermission = {
  id: string | number // `*` to access all
  actions: AuthAction[]
}

export type ResourcePolicy = Record<
  ClientResource | SystemResource,
  PolicyPermission[]
>
