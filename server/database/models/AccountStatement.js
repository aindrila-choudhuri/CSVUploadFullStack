const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const Schema = mongoose.Schema;

const accountStatementSchema = new Schema({
  folioNumber: { type: String, Required: 'Folio number cannot be left blank.'},
  unitPrice:    { type: Number, Required:'Unit price cannot be left blank.'},
  unitsBought: { type: Number , Required: 'Units bought cannot be left blank'},
  totalPrice: { type: Number, Required: 'Total price cannot be left blank'},
  dateTime: { type: Date, Required: 'Date cannot be left blank' },
  userID: { type: String, Required: 'User ID cannot be left blank' }
});

accountStatementSchema.plugin(mongoosePaginate);

const AccountStatement = new mongoose.model('accountStatement', accountStatementSchema);

module.exports = AccountStatement;