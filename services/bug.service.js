import fs from 'fs'
import { utilService } from './util.service.js'

const bugs = utilService.readJsonFile('../data/bugs.json')

export const bugService ={
    query,
    getById,
    save,
    remove
}

async function query(){
    try{
        return bugs
    }catch(error){
        console.error(error)
        throw error
    }
}

async function getById(bugId){
    try{
        const bug = bugs.find(bug=>bug._id===bugId)
        return bug
    }catch(error){
        console.error(error)
        throw error
    }
}

async function remove(bugId){
    try{
        const bugIdx = bugs.findIndex(bug => bug._id === bugId)
        bugs.splice(bugIdx, 1)
        _saveBugsToFile()
    }catch(error){
        console.error(error)
        throw error
    }
}

async function save(bugToSave) {
    try {
        if (bugToSave._id) {
            console.log('bugToSave._id',bugToSave._id)
            const idx = bugs.findIndex(bug => bug._id === bugToSave._id)
            if (idx < 0) throw `Cant find bug with _id ${bugToSave._id}`
            bugs[idx] = bugToSave
        } else {
            bugToSave._id = utilService.makeId()
            bugs.push(bugToSave)
        }
        console.log('bugToSave2',bugToSave)
        await _saveBugsToFile()
        return bugToSave
    } catch (error) {
        console.error(error)
        throw error
    }
}

function _saveBugsToFile(path = './data/bugs.json') {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(bugs, null, 4)
        fs.writeFile(path, data, (err) => {
            if (err) return reject(err)
            resolve()
        })
    })
}