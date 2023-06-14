const {Card: CardModel} = require("../models/Card")


const cardController = {
    create: async(req, res) => {
        try {
            const cardNumber = RandomNumber()
            const cvv = Math.floor(Math.random() * 900) + 100
            const card = {
                agency: req.body.agency,
                account: req.body.account,
                cpf: req.body.cpf,
                dataOfBirth: req.body.dataOfBirth,
                fullName: req.body.fullName,
                nameForCard: req.body.nameForCard,
                flag: req.body.flag,
                type: req.body.type,
                expirationDate: req.body.expirationDate,
                password: req.body.password,
                state: "Requested",
                cardNumber: cardNumber,
                cvv: cvv
            }

            const response = await CardModel.create(card)

            res.status(201).json({response, msg: "card created successfully"})
        } catch (error) {
            console.log(error);
        }
    },
    getAll: async (req, res) => {
        try {
            const cards = await CardModel.find()

            res.json(cards)
        } catch (error) {
            console.log(error);
        }
    },
    get: async (req,res) => {
        try {
            const cardNumber = req.params.cardNumber
            const card = await CardModel.findOne({ cardNumber })

            if (!card) {
                res.status(404).json({msg: "Card not found"})
                return
            }

            res.json({"Number": card.cardNumber,
                      "Name" : card.nameForCard,
                      "Limit": card.limit,
                      "State": card.state,
                      "Expiration date": card.expirationDate,
                      "CVV": card.cvv
        })
    
        } catch (error) {
            console.log(error);
            res.status(500).json({ msg: "Internal server error" });
        }
    },changeState: async (req,res) =>{
        try {
            const cardNumber = req.params.cardNumber

            //TRATAR: 
            //cartao só podera ser ativado com o status entregue
            //cartao só podera ser bloqueado com o status ativo

            const card = {
                state: req.body.state,
                motive: req.body.motive
            }

            const updateCard = await CardModel.findOneAndUpdate({cardNumber}, card)
            
            if (!card) {
                res.status(404).json({msg: "Card not found"})
                return
            }

            res.status(200).json({card, msg: `Card has been ${card.state}`})
        } catch (error) {
            console.log(error);
        }
    }

}
function RandomNumber(params) {
    let randomNumber = "";
            for (let i = 0; i < 16; i++) {
              const digit = Math.floor(Math.random() * 10);
              randomNumber += digit;
            }
    return parseInt(randomNumber)
}

module.exports = cardController

// o número do cartão, agência, conta e senha do cliente.