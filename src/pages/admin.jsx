import { Admin } from '@/components/html/Admin/Admin'

export default Admin

export async function getStaticProps() {
  return { props: { title: 'Agape Ecosystem' } }
}

//
