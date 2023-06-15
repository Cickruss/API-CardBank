const {Card: CardModel} = require("../models/Card")



const cardController = {
    create: async(req, res) => {
        try {
            const card = {
                agency: req.body.agency,
                account: req.body.account,
                cpf: req.body.cpf,
                dateOfBirth: req.body.dateOfBirth,
                fullName: req.body.fullName,
                nameForCard: req.body.nameForCard,
                flag: req.body.flag,
                type: req.body.type,
                expirationDate: req.body.expirationDate,
                password: req.body.password,
                confirmPassword: req.body.confirmPassword,
                state: "requested",
                number: RandomNumber(),
                cvv: Math.floor(Math.random() * 900) + 100,
                limit: getLimit()
            }

            const validationMessage = validateCreatePassword(card.password, card.confirmPassword, card.dateOfBirth)

            if (validationMessage !== 0) {
                res.status(406).json({validateCreatePassword})
                console.log(validationMessage)
                return
            }

            const valitionMessageAge = validateAge(card.dateOfBirth)

            if (valitionMessageAge !== 0) {
                res.status(406).json({valitionMessageAge})
                return
            }
            
            const response = await CardModel.create(card)

            res.status(201).json({"Number": card.number,
                                    "Name" : card.nameForCard,
                                    "Expiration date": card.expirationDate,
                                    msg: "card created successfully."
        })
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
            const number = req.body.number
            const card = await CardModel.findOne({ number })

            if (!card) {
                res.status(404).json({msg: "Card not found"})
                return
            }

            res.json({"Number": card.number,
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
            const password = req.body.password
            const confirmPassword = req.body.confirmPassword
            const state = req.body.state
            const motive = req.body.motive
            const number = req.body.number
            const agency = req.body.agency
            const account = req.body.account

            const cardInDatabase = await CardModel.findOne({ number })
            
            const validationMesseger = validateInDatabase(password, confirmPassword,number,agency,account, cardInDatabase)

            if (validationMesseger !== 0) {
                res.status(406).json({msg: validationMesseger})
                return
            }

            if (!((state === "activated" && cardInDatabase.state === "delivered") || (state === "locked" && cardInDatabase.state === "activated") || (state === "delivered" && cardInDatabase.state === "requested") || (state === "canceled"))) {
                res.status(406).json({msg: `The card cannot be ${state} if it is ${cardInDatabase.state}.`})
                return
            }
            
            const card = {
                state: state,
                motive: motive
            }

            const updateCard = await CardModel.findOneAndUpdate({number}, card)
            
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

function validateCreatePassword(password,confirmPassword, dateOfBirth) {

  if (password !== confirmPassword) {
    return "The password and confirmation must be the same.";
  }

  if (password.toString().length !== 6) {
    return "The password must be exactly 6 digits long."
  }

  dateOfBirthString = dateOfBirth.toString()
  const yearOfBirth = parseInt(dateOfBirthString.slice(-2))
  dateOfBirth = Math.floor(dateOfBirth / 10000)
  const newDateOfBirth = parseInt(dateOfBirth.toString() + yearOfBirth.toString())

  if (password === newDateOfBirth) {
    return "The password cannot be the same as the date of birth or contain the last two digits of the birth year.";
  }
  


  const digits = password.toString().split("")
  const uniqueDigits = [...new Set(digits)];
  if (uniqueDigits.length !== 6) {
    return "The password cannot have repeated numbers."
  }


  for (let i = 0; i < digits.length - 1; i++) {
    const currentDigit = parseInt(digits[i])
    const nextDigit = parseInt(digits[i + 1])
    if (currentDigit + 1 === nextDigit) {
      return "The password cannot have sequential numbers."
    }
  }

  return 0
}
function validateInDatabase(password, confirmPassword,number, agency, account, cardInDatabase) {
    if (password !== confirmPassword) {
        return "The passwords must be the same."
    }
    if (password !== cardInDatabase.password) {
        return "The password is incorrect."
    }
    if (number !== cardInDatabase.number) {
        return "The number is incorrect."
    }
    if (agency !== cardInDatabase.agency) {
        return "The agency is incorrect."
    }
    if (account !== cardInDatabase.account) {
        return "The account is incorrect."
    }
    return 0
}
function validateAge(dateOfBirth){
    const currentYear = new Date().getFullYear()
    const yearDateOfBirth = parseInt(dateOfBirth.toString().slice(-4))

    if ((currentYear - yearDateOfBirth) < 18) {
        return "you are not of an appropriate age to use the system."
    }
    return 0
}
function getLimit(params) {
    const limits = [400, 800, 1000, 1500, 2000]

    return limits[Math.floor(Math.random() * limits.length)]
}

module.exports = cardController
