function makeItemsArray() {
  return [
{id: 1, name:'Jon'},
{id: 2, name: 'Jane'},
{id: 3, name: 'Jimmy'},
{id: 4, name: 'Jeremiah'}
  ]
}

function makeMaliciousItem() {
  const maliciousItem = {
    id: 100,
    name: 'Sally <script>alert("xss");</script>',
  }
  const expectedItem = {
    ...maliciousItem,
    name: 'Sally &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
  }
  return {
    maliciousItem,
    expectedItem,
  }
}

module.exports = {
  makeItemsArray,
  makeMaliciousItem,
}
