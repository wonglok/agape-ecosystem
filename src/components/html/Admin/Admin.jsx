import { Gate, logout } from '@/backend/aws'

export function Admin() {
  return (
    <Gate>
      <button
        onClick={() => {
          //
          logout()
        }}>
        Signout
      </button>
      <div>Yo</div>
    </Gate>
  )
}

//
