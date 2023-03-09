import { PageMaterialStudio } from '@/components/html/PageMaterialStudio/PageMaterialStudio'

export default PageMaterialStudio

export async function getStaticProps() {
  return { props: { title: 'Agape Ecosystem' } }
}

//
