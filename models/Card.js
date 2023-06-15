const mongoose = require("mongoose")

const { Schema } = mongoose

const cardSchema = new Schema({
  agency: {
    type: Number,
    required: true
  },
  account: {
    type: Number,
    required: true
  },
  cpf: {
    type: String,
    required: true
  },
  dateOfBirth: {
    type: Number,
    required: true
  },
  fullName: {
    type: String,
    required: true
  },
  nameForCard: {
    type: String,
    required: true
  },
  flag: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  expirationDate: {
    type: String,
    required: true
  },
  password: {
    type: Number,
    required: true
  },
  confirmPassword: {
    type: Number,
    required: true
  },
  state: {
    type: String
  },
  number: {
    type: Number,
  },
  cvv: {
    type: Number
  },
  limit:{
    type: Number
  },
  motive:{
    type: String
  }

}, { timestamps: true })

const Card = mongoose.model("Card", cardSchema)
module.exports = { Card, cardSchema }
