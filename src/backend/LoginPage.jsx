import { Modal } from '@mantine/core'
import { useEffect, useState } from 'react'
import { loginMetamask } from './aws'

export function LoginPage() {
  let [opened, setOpened] = useState(true)

  useEffect(() => {}, [])
  return (
    <>
      <Modal
        opened={opened}
        closeOnClickOutside={false}
        withCloseButton={false}
        closeOnEscape={false}
        onClose={() => setOpened(false)}
        title='Login to Admin'>
        {/* Modal content */}

        <div>
          <button
            className='p-2 px-5 text-white bg-yellow-500 rounded-xl'
            onClick={() => {
              loginMetamask()
            }}>
            Metamask
          </button>
        </div>
      </Modal>
      <div className='flex items-center justify-center w-full h-full'>
        <div
          onClick={() => {
            //
            setOpened(true)
          }}>
          Yo, Let's Login...
        </div>
      </div>
    </>
  )
}
