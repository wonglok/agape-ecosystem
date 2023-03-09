import { PageMaterialEditor } from '@/components/html/PageMaterialEditor/PageMaterialEditor'
import { useRouter } from 'next/router'

export default function Editor() {
  let router = useRouter()

  let query = router.query || {}

  let materialID = query.materialID
  return (
    <>
      {materialID && <PageMaterialEditor materialID={materialID}></PageMaterialEditor>}

      {/*  */}
      {/*  */}
      {/*  */}
    </>
  )
}

//
//
//
