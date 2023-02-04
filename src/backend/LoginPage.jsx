import { loginMetamask } from './aws'

export function LoginPage() {
  return (
    <>
      <div></div>
      <div className='flex items-center justify-center w-full h-full'>
        <div>
          <button
            className='p-2 px-5 text-white bg-yellow-500 rounded-xl'
            onClick={() => {
              loginMetamask()
            }}>
            Login with Metamask
          </button>
        </div>
      </div>
    </>
  )
}
