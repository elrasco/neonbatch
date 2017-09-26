module.exports = {
  changeId: fieldName => obj => {
    obj[fieldName || 'objectId'] = obj.id
    return obj;
  }
};