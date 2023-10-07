const { log } = console
const { readFileSync } = require('fs')
const { stdout, stdin } = process
const { createInterface } = require('readline')

const redate = /^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/
const cli = createInterface({ input: stdin, output: stdout })

const sum = xs => xs.reduce((a, b) => a + b, 0)
const digits = s => s.toString().split('').map(x => parseInt(x, 10))

cli.setPrompt('Enter your birthdate (mm/dd/yyyy): ')

cli.on('line', input => {
    const birthdate = new Date(input)

    if (!redate.test(input) || birthdate.toString() === 'Invalid Date') {
        log(`
Sorry, Invalid date. Please provide a date in the following format: mm/dd/yyyy
For example: 12/20/1985
        `)
        return cli.prompt()
    }

    const month = birthdate.getMonth() + 1
    const day = birthdate.getDate()
    const year = birthdate.getFullYear()
    const monthDaySum = month + day
    const yearSum = sum(digits(year))
    const chap = monthDaySum
    const verse = yearSum
    
    log('\n--------------------------------------------------------------------')
    log(`Birthday: "${birthdate}"`)
    log('---------------------------------------------------------------------\n')
    log(`month (${month}) + day (${day}) = ${monthDaySum}`)
    log(`year (${year}) digits sum (${digits(year).join('+')}) = ${yearSum}\n`)
    log(`Searching for scriptures that have chapter ${chap} and verse ${verse}...`)
   
    setTimeout(() => {
        const verses = readFileSync('kjv.txt', 'utf8').split(/\r?\n/g)
        const birthVerses = verses.filter(v => v.includes(`${chap}:${verse}`))
        log(`===============================================================\n`)    

        log(birthVerses.map(v => {
            const [book, ref] = v.split(' ', 3)
            const rest = v.replace(`${book} ${ref} `, '')
            const text = rest.replace(/\[(.*?)\]/g, '$1')
            return `${book} ${ref} "${text}"`
        }).join('\n\n'))
    }, 1000)
    cli.close()
}).prompt()
