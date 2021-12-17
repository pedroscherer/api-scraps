import express, { Request, Response } from 'express';

const cors = require('cors')
const app = express();
const hostname = 'localhost';
const port = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

app.listen(port, () => {
    console.log(`server running at http://${hostname}:${port}/`);
});

class scraps{
    public id: number;
    public description: string;
    public details: string;

    constructor(id: number, description: string, details: string) {
        this.id = id;
        this.description = description;
        this.details = details;
    }   
}

let listScraps: Array<scraps> = [];
let idScraps: number = 0;

app.post('/scraps', (req: Request, res: Response) => {
    let { description, details } = req.body;
    if(description && details) {
        idScraps++;
        const scrapCreate: scraps = new scraps(idScraps, description, details);
        listScraps.push(scrapCreate);
        res.status(200).json(scrapCreate);
    } else {
        res.status(400).send('falta informar algum campo')
    }
});

app.get('/scraps',(req: Request, res: Response) => {
    res.status(201).json(listScraps);
});

app.get('/scraps/:id', (req: Request, res: Response) => {
    const id: number = Number(req.params.id);
    let scrapFound: scraps | undefined = listScraps.find(
        (scrap) => scrap.id == id
    );
    
    if(scrapFound) {
        res.status(200).json(scrapFound);
    } else {
        res.status(404).send('recado não encontrado');
    }
});

app.put('/scraps/:id', (req: Request, res: Response) => {
    const id: number = Number(req.params.id);
    let { description, details } = req.body;
    let indexFound = listScraps.findIndex((scrap) => scrap.id == id);

    if(indexFound > -1) {
        if(description !== "undefined") listScraps[indexFound].description = description;
        if(details !== "undefined") listScraps[indexFound].details = details;
        res.status(200).send(listScraps[indexFound]);
    } else {
        res.status(404).send('recado não encontrado')
    }

});

app.delete('/scraps/:id', (req: Request, res: Response) => {
    const id: number = Number(req.params.id);
    let indexFound = listScraps.findIndex((scrap) => scrap.id == id);

    if(indexFound > -1) {
        res.status(200).send(listScraps.splice(indexFound, 1));
    } else {
        res.status(404).send('recado não encontrado')
    }

});
