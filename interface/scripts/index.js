const openNode = function(id) {
  console.log('Opening ' + id)
  $.getJSON('./nodes/get/' + id, function(data) {
    console.log('Got:')
    console.log(data)
    $('#currentNodeTitle').html(data['title'])
    $('#currentNodeContent').html(data['content'])
  })
}

latest = []
const fetchLatest = function(data) {
  latest = data
  for(i = 0; i < Math.min(data.length, 5); i++) {
    newelem = '<div class="media text-muted pt-3"><p class="media-body pb-3 mb-0 small lh-125 border-bottom border-gray"><strong class="d-block text-gray-dark"><a href="#" onclick="openNode(\'' + data[i]['_id'] + '\')">' + data[i]['title'] + '</a></strong>' + data[i]['content'] + '</p></div>'
    $('#latestnodesdiv').append(newelem)
  }
}

$.getJSON('./nodes/latest', fetchLatest)
