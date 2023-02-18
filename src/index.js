import * as echarts from "echarts"
import {data} from "./data"
import './style.css'

const arr = data.map(p=>p.period)
const period = [...new Set(arr)]
const ar = data.map(p=>p.name)
const legend = [...new Set(ar)]

const getValue = str => {
  const res = []
  const t = data.filter(({name})=>name === str)
  t.forEach(({value})=> res.push(value))
  return res
}

const dom = document.getElementById('chart-container')
const myChart = echarts.init(dom, null, {
  renderer: 'canvas',
  useDirtyRect: false
})

const options = {
  title: {
    text: 'Проекты в программах и вне программ',
    subtext:'Сумма и процентное соотношение проектов, находящихся в программах и вне программ',
    textStyle:{
      fontFamily: 'Inter',
      color:'#002033',
    }
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: "shadow"
    },
    formatter: function(params) {
      let periods = params[0].name
      let inProgram = 0
      let inProgramCP = 0
      let inProgramIT = 0
      let outOfProgram = 0
      let outOfProgramCP = 0
      let outOfProgramIT = 0
      let colorInProgramCP
      let colorInProgramIT
      let colorOutProgramCP
      let colorOutProgramIT

      for (let i = 0; i < params.length; i++) {
        let seriesName = params[i].seriesName
        let value = params[i].value
        if (seriesName === "В программе ЦП") {
          inProgramCP = value
          inProgram += value
          colorInProgramCP = params[i].color
        } else if (seriesName === "В программе ИТ") {
          inProgramIT = value
          inProgram += value
          colorInProgramIT = params[i].color
        } else if (seriesName === "Вне программ ЦП") {
          outOfProgramCP = value
          outOfProgram += value
          colorOutProgramCP = params[i].color
        } else if (seriesName === "Вне программ ИТ") {
          outOfProgramIT = value
          outOfProgram += value
          colorOutProgramIT = params[i].color
        }
      }
      let total = inProgram + outOfProgram
      let inProgramPercent = ((inProgram / total) * 100).toFixed(2) + "%"
      let outOfProgramPercent = ((outOfProgram / total) * 100).toFixed(2) + "%"
      const resulValue = (title,value,col) => {
        let tem = ''
        if(value) {
          tem = `<span class="tooltip_group">  
                    <span class="tooltip_circle" style="background-color:${col}"></span> 
                    <span class="tooltip_group_title"> ${title}</span>
                    <span class="tooltip_value"> ${value} шт.</span>  
                </span>`
        }
       return tem
      }

      return ` <div class="tooltip">
        <span class="tooltip_title">${periods} 2022</span><br/>
        <span class="tooltip_group">  
           <span class="tooltip_title">
            В программе 
          </span>
           <span class="tooltip_value">
                ${inProgramPercent} | ${inProgram} шт.
           </span> 
        </span> 
            ${resulValue('Проекты ИТ',inProgramIT,colorInProgramIT)}
            ${resulValue('Проекты ЦП',inProgramCP,colorInProgramCP)}
         <span class="tooltip_group">  
          <span class="tooltip_title">
            Вне программ 
          </span>
          <span class="tooltip_value">
               ${outOfProgramPercent} | ${outOfProgram} шт.
          </span>
        </span> 
            ${resulValue('Проекты ИТ',outOfProgramIT,colorOutProgramIT)}
            ${resulValue('Проекты ЦП',outOfProgramCP,colorOutProgramCP)}
            </div> `
    }
  },
  legend: {
    icon: 'circle',
    bottom: 0,
    data: legend
  },
  xAxis: {
    type: 'category',
    data: period
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      name: 'Вне программ ИТ',
      type: 'bar',
      stack: 'off',
      color:'#00724C',
      emphasis: {
        focus: 'series'
      },
      data: getValue('Вне программ ИТ')
    },
    {
      name: 'Вне программ ЦП',
      type: 'bar',
      stack: 'off',
      color:'#22C38E',
      emphasis: {
        focus: 'series'
      },
      data: getValue('Вне программ ЦП')
    },
    {
      name: 'В программе ЦП',
      type: 'bar',
      stack: 'in',
      color:'#56B9F2',
      emphasis: {
        focus: 'series'
      },
      data: getValue('В программе ЦП')
    },
    {
      name: 'В программе ИТ',
      type: 'bar',
      stack: 'in',
      color:'#0078D2',
      emphasis: {
        focus: 'series'
      },
      data: getValue('В программе ИТ')
    },
  ]
}

if (options && typeof options === 'object') {
  myChart.setOption(options)
}

window.addEventListener('resize', myChart.resize)

