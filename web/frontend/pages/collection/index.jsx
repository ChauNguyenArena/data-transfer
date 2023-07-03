import React, { useState } from 'react'
import { read, utils } from 'xlsx'
import MyDropZoneSingle from '../../components/MyDropZoneSingle'
import { Button, LegacyStack, Modal, Spinner } from '@shopify/polaris'

import CustomCollectionApi from '../../apis/custom_collection'

function CollectionPage() {
  const [workbook, setWorkbook] = useState(null)
  const [loading, setLoading] = useState(false)

  const getWorkbook = async (file) => {
    try {
      const f = await file.arrayBuffer()
      const wb = read(f) // parse the array buffer

      const ws = wb.Sheets[wb.SheetNames[0]] // get the first worksheet
      let data = utils.sheet_to_json(ws) // generate objects

      setWorkbook(data)
    } catch (error) {
      console.log('error', error)
    }
  }

  const handleImportCollections = async (data) => {
    let res = null
    res = await CustomCollectionApi.create(data)

    console.log('res:>>', res)
    setLoading(false)
  }

  const handleDeleteCollections = async (data) => {
    let res = null
    res = await CustomCollectionApi.delete(data)

    // console.log('res:>>', res)
    setLoading(false)
  }

  console.log('workbook :>> ', workbook)

  return (
    <LegacyStack vertical alignment="fill">
      <MyDropZoneSingle onChange={(value) => (value ? getWorkbook(value) : null)} />
      <LegacyStack distribution="trailing">
        <Button
          primary
          onClick={() => {
            handleImportCollections(workbook)
            setLoading(true)
          }}
          disabled={!workbook}
        >
          Convert
        </Button>
        <Button
          onClick={() => {
            handleDeleteCollections(workbook)
            setLoading(true)
          }}
          disabled={!workbook}
        >
          Delete
        </Button>
      </LegacyStack>
    </LegacyStack>
  )
}

export default CollectionPage
