import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://elcfvoujpelpwbufwyze.supabase.co'
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVsY2Z2b3VqcGVscHdidWZ3eXplIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzgzODk4OTAsImV4cCI6MTk5Mzk2NTg5MH0.UZSUFFiAD2vcFSDP_aYdFawaQNlSol8b6yqBTSbbcS4"
const supabase = createClient(supabaseUrl, supabaseKey)
const db = 'scores_data'


// FOR THE SINGLE GAME
async function getScore_single() {
    const { data, error } = await supabase
        .from(db)
        .select('id,scores_player')
        .limit()
        .single()

    return data
}

async function updateScore_single() {


    const { error } = await supabase
        .from(db)
        .update({ scores_player: score1 })
        .eq('id', getScore_player['id'])
}

async function getScores_bot() {
    const { data, error } = await supabase
        .from(db)
        .select('id,scores1_bot')
        .limit(1)
        .single()

    return data
}

async function updateScore_bot() {


    const { error } = await supabase
        .from(db)
        .update({ scores1_bot: score2 })
        .eq('id', getScore_bot['id'])
}

// // Add X or O to the selected cell 
function add(number) {

    // Gets out of function overall
    if (finish) {
        return
    }

    // Checks if div empty and that game isn't at tie
    if (count <= 9 && document.getElementById('box' + number).childNodes.length === 0) {
        let update_cross = cross.cloneNode(true)

        // Updates div
        document.getElementById('box' + number).appendChild(update_cross)
        boxes[number] = ('X')

        // Finds index with O or X in div already and removes from possible bot options
        let found = random.indexOf(parseInt(number))
        let new_random = random.splice(found, 1)
        count++
        player.innerHTML = "Bot's turn: Circles go"
        check()
        // Gets out of function- in the middle of the code so that it can break when cross wins too
        if (finish) {
            return
        }
        let update_circle = circle.cloneNode(true)

        // Choose a random number
        let random_num = random[Math.floor(Math.random() * random.length)];

        // Updates div
        document.getElementById('box' + random_num).appendChild(update_circle)
        boxes[random_num] = ('O')

        // Finds index with O or X already
        found = random.indexOf(parseInt(random_num))

        // Prevents O and X from being on same div by removing it from bot options
        new_random = random.splice(found, 1)
        player.innerHTML = "Player 1's turn: Crosses go"
        count++
        check()
    }
}

// Checks if the combinations are true, if so, increases the player's score and displays winner
function check() {

    // Checks for cross
    if ((boxes[1] == "X" && boxes[4] == "X" && boxes[7] == "X") || (boxes[2] == "X" && boxes[5] == "X" && boxes[8] == "X") || (boxes[3] == "X" && boxes[9] == "X" && boxes[6] == "X") || (boxes[1] == "X" && boxes[5] == "X" && boxes[9] == "X") || (boxes[3] == "X" && boxes[5] == "X" && boxes[7] == "X") || (boxes[1] == "X" && boxes[2] == "X" && boxes[3] == "X") || (boxes[4] == "X" && boxes[5] == "X" && boxes[6] == "X") || (boxes[7] == "X" && boxes[8] == "X" && boxes[9] == "X")) {
        // Update score and show who won
        score1++
        player.innerHTML = "Cross wins!"
        updateScore_single(score1)
        win1.innerHTML = "Player 1 Wins: " + score1
        finish = true
        return

        // Checks for circle
    }
    if ((boxes[1] == "O" && boxes[4] == "O" && boxes[7] == "O") || (boxes[2] == "O" && boxes[5] == "O" && boxes[8] == "O") || (boxes[3] == "O" && boxes[9] == "O" && boxes[6] == "O") || (boxes[1] == "O" && boxes[5] == "O" && boxes[9] == "O") || (boxes[3] == "O" && boxes[5] == "O" && boxes[7] == "O") || (boxes[1] == "O" && boxes[2] == "O" && boxes[3] == "O") || (boxes[4] == "O" && boxes[5] == "O" && boxes[6] == "O") || (boxes[7] == "O" && boxes[8] == "O" && boxes[9] == "O")) {
        // Update score and show who won
        player.innerHTML = "Circle wins!"
        score2++
        updateScore_bot(score2)
        win2.innerHTML = "Bot Wins: " + score2
        finish = true
        return

        // Checks tie
    }
    if (count == 9) {
        player.innerHTML = "Tie"
    }
}

async function start() {
    getScore_player = await getScore_single()
    getScore_bot = await getScores_bot()
    //  Set up
    score1 = getScore_player['scores_player']
    score2 = getScore_bot['scores1_bot']


    cross.src = "https://www.freeiconspng.com/thumbs/x-png/x-png-15.png"
    circle.src = "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Red_circle.svg/768px-Red_circle.svg.png"
    player.innerHTML = "Player 1's turn: Crosses go"
    win1.innerHTML = "Player 1 Wins: " + score1
    win2.innerHTML = "Bot Wins: " + score2
    // Event listeners for the resetters
    button_score.addEventListener("click", async (event) => {
        score1 = 0
        score2 = 0
        await updateScore_single(score1)
        await updateScore_bot(score2)
        window.location.reload()
    })
    button_board.addEventListener("click", () => {
        window.location.reload()
    })


    // BACKUP
    //   boxes.forEach(box => {
    //     box.addEventListener("click", () => {
    //       add(box.id.slice(-1))
    //     }, { once: true })
    //   })
    // }


    // AddEventListener and run function for cell clicked- run only once

    for (let i = 1; i <= boxes.length; i++) {
        document.getElementById("box" + i).addEventListener("click", () => {
            add(i)
        }, { once: true })
    }
}

let count = 0
let finish = false
let random = [1, 2, 3, 4, 5, 6, 7, 8, 9]
let boxes = Array.from(document.querySelectorAll("[id^='box']"))
let score2 = 0
let score1 = 0
let getScore_player
let getScore_bot
const player = document.querySelector("#player_turn")
const win1 = document.querySelector("#scores1")
const win2 = document.querySelector("#scores2")
const button_score = document.querySelector("#reset_score")
const button_board = document.querySelector("#reset_board")
const circle = document.createElement("img")
const cross = document.createElement("img")

start()

// REFERENCE
// https://bobbyhadz.com/blog/javascript-check-if-div-is-empty
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf
// https://www.w3schools.com/jsref/jsref_indexof.asp
// https://stackoverflow.com/questions/14592115/javascript-indexof-not-working-on-an-int-array