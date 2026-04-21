import { useEffect, useState } from "react"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { getSalesByGenre } from '../../api/client'
import LoadingSpinner from '../LoadingSpinner'

