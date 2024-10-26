document.addEventListener('DOMContentLoaded', () => {
    const gridDisplay = document.querySelector('.grid')
    const scoreDisplay = document.querySelector('#score')
    const resultDisplay = document.querySelector('#result')

    const width = 4
    let score = 0
    let cells = []



    function createBoard () {
        for (let i = 0; i < width * width; i ++) {
            const cell = document.createElement('div')
            cell.innerHTML = 0
            gridDisplay.appendChild(cell)
            cells.push(cell)
        }
        generate()
        generate()
    }
    createBoard()



    function generate () {
        const randomNumber = Math.floor(Math.random() * cells.length)
        if (cells[randomNumber].innerHTML == 0) {
            cells[randomNumber].innerHTML = 2
            checkForGameOver()
        }
        else {
            generate()
        }
    }



    function moveRight () {
        for (let i = 0; i < 16; i++) {
            if (i % 4 === 0) {
                let totalOne = cells[i].innerHTML
                let totalTwo = cells[i + 1].innerHTML
                let totalThree = cells[i + 2].innerHTML
                let totalFour = cells[i + 3].innerHTML
                let row = [parseInt(totalOne), parseInt(totalTwo), parseInt(totalThree), parseInt(totalFour)]
            
                let filteredRow = row.filter(num => num)
                let missing = 4 - filteredRow.length
                let zeros = Array(missing).fill(0)
                let newRow = zeros.concat(filteredRow)
                // filteredRow.length()
                cells[i].innerHTML = newRow[0]
                cells[i + 1].innerHTML = newRow[1]
                cells[i + 2].innerHTML = newRow[2]
                cells[i + 3].innerHTML = newRow[3]
            }
        }
    }



    function moveLeft () {
        for (let i = 0; i < 16; i ++) {
            if (i % 4 === 0) {
                let totalOne = cells[i].innerHTML
                let totalTwo = cells[i + 1].innerHTML
                let totalThree = cells[i + 2].innerHTML
                let totalFour = cells[i + 3].innerHTML
                let row = [parseInt(totalOne), parseInt(totalTwo), parseInt(totalThree), parseInt(totalFour)]
            
                let filteredRow = row.filter(num => num)
                let missing = 4 - filteredRow.length
                let zeros = Array(missing).fill(0)
                let newRow = filteredRow.concat(zeros)
                // filteredRow.length()
                cells[i].innerHTML = newRow[0]
                cells[i + 1].innerHTML = newRow[1]
                cells[i + 2].innerHTML = newRow[2]
                cells[i + 3].innerHTML = newRow[3]
            }
        }
    }



    function moveUp () {
        for (let i = 0; i < 4; i++) {
            let totalOne = cells[i].innerHTML
            let totalTwo = cells[i + width].innerHTML
            let totalThree = cells[i + width*2].innerHTML
            let totalFour = cells[i + width*3].innerHTML
            let column = [parseInt(totalOne), parseInt(totalTwo), parseInt(totalThree), parseInt(totalFour)]
        
            let filteredColumn = column.filter(num => num)
            let missing = 4 - filteredColumn.length
            let zeros = Array(missing).fill(0)
            let newColumn = filteredColumn.concat(zeros)
                // filteredRow.length()
            cells[i].innerHTML = newColumn[0]
            cells[i + width].innerHTML = newColumn[1]
            cells[i + width*2].innerHTML = newColumn[2]
            cells[i + width*3].innerHTML = newColumn[3]
        }
    }



    function moveDown () {
        for (let i = 0; i < 4; i++) {
            let totalOne = cells[i].innerHTML
            let totalTwo = cells[i + width].innerHTML
            let totalThree = cells[i + width*2].innerHTML
            let totalFour = cells[i + width*3].innerHTML
            let column = [parseInt(totalOne), parseInt(totalTwo), parseInt(totalThree), parseInt(totalFour)]
            let filteredColumn = column.filter(num => num)
            let missing = 4 - filteredColumn.length
            let zeros = Array(missing).fill(0)
            let newColumn = zeros.concat(filteredColumn)
                // filteredRow.length()
            cells[i].innerHTML = newColumn[0]
            cells[i + width].innerHTML = newColumn[1]
            cells[i + width*2].innerHTML = newColumn[2]
            cells[i + width*3].innerHTML = newColumn[3]
        }
    }



    function combineRow () {
        for (let i =0; i < 15; i++) {
            if (cells[i].innerHTML == cells[i + 1].innerHTML) {
                let combineTotal = parseInt(cells[i].innerHTML) + parseInt(cells[i+1].innerHTML)
                cells[i].innerHTML =  combineTotal
                cells[i + 1].innerHTML = 0
                score += combineTotal
                scoreDisplay.innerHTML = score
            }
        }
        checkForWin()
    }



    function combineColumn () {
        for (let i =0; i < 12; i++) {
            if (cells[i].innerHTML == cells[i + width].innerHTML) {
                let combineTotal = parseInt(cells[i].innerHTML) + parseInt(cells[i+width].innerHTML)
                cells[i].innerHTML =  combineTotal
                cells[i + width].innerHTML = 0
                score += combineTotal
                scoreDisplay.innerHTML = score
            }
        }
        checkForWin()
    }



    function control(e) {
        if (e.key === 'ArrowLeft') {
            keyLeft()
        } else if (e.key === 'ArrowRight') {
            keyRight()
        } else if (e.key === 'ArrowUp') {
            keyUp()
        } else if (e.key === 'ArrowDown') {
            keyDown()
        }
    }
    document.addEventListener('keydown', control)



    function keyLeft () {
        moveLeft()
        combineRow()
        moveLeft()
        generate()
    }



    function keyRight () {
        moveRight()
        combineRow()
        moveRight()
        generate()
    }



    function keyUp () {
        moveUp()
        combineColumn()
        moveUp()
        generate()
    }



    function keyDown () {
        moveDown()
        combineColumn()
        moveDown()
        generate()
    }
    


    function checkForWin () {
        for (let i = 0; i < cells.length; i++) {
            if (cells[i].innerHTML == 2048) {
                resultDisplay.innerHTML = "You WIN!"
                document.removeEventListener('keydown', control)
                setTimeout(clear, 3000)
            }
        }
    }



    function checkForGameOver () {
        let zeros = 0
        for (let i = 0; i < cells.length; i++) {
            if (cells[i].innerHTML == "0") {
                zeros++
            }
        }
        if (zeros === 0) {
            resultDisplay.innerHTML = "You LOSE!"
            document.removeEventListener('keydown', control)
            setTimeout(clear, 3000)
        }
    }
    


    function clear () {
        clearInterval(myTimer)
    }



    function addColors () {
        for (let i = 0; i < cells.length; i++) {
            if (cells[i].innerHTML == "0") {cells[i].style.backgroundColor = '#BDAC97';cells[i].style.color = '#BDAC97'}
            else if (cells[i].innerHTML == "2") {cells[i].style.backgroundColor = '#EEE4DA';cells[i].style.color = '#756452'}
            else if (cells[i].innerHTML == "4") {cells[i].style.backgroundColor = '#EBD8B6';cells[i].style.color = '#756452'}
            else if (cells[i].innerHTML == "8") {cells[i].style.backgroundColor = '#F1AE72';cells[i].style.color = '#FFFFFF'}
            else if (cells[i].innerHTML == "16") {cells[i].style.backgroundColor = '#F69360';cells[i].style.color = '#FFFFFF'}
            else if (cells[i].innerHTML == "32") {cells[i].style.backgroundColor = '#F57658';cells[i].style.color = '#FFFFFF'}
            else if (cells[i].innerHTML == "64") {cells[i].style.backgroundColor = '#F55A35';cells[i].style.color = '#FFFFFF'}
            else if (cells[i].innerHTML == "128") {cells[i].style.backgroundColor = '#F3CE51';cells[i].style.color = '#FFFFFF'}
            else if (cells[i].innerHTML == "256") {cells[i].style.backgroundColor = '#F5CC46';cells[i].style.color = '#FFFFFF'}
            else if (cells[i].innerHTML == "512") {cells[i].style.backgroundColor = '#F0C656';cells[i].style.color = '#FFFFFF'}
            else if (cells[i].innerHTML == "1024") {cells[i].style.backgroundColor = '#EDC53F';cells[i].style.color = '#FFFFFF'}
            else if (cells[i].innerHTML == "2048") {cells[i].style.backgroundColor = '#EDC53F';cells[i].style.color = '#FFFFFF'}
        }
    }
    addColors()


    
    let myTimer = setInterval(addColors, 50)
})