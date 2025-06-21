import { Box } from '@mui/material'
import React from 'react'
import Header from '../component/Header'
import BarChart from '../../component/BarChart'

const Bar = () => {
  return (
    <Box m="20px">
      <Header title="Bar Chart" subtitle="Simple Bar Chart" />
      <Box height="75vh">
        <BarChart />
      </Box>
    </Box>
  )
}

export default Bar