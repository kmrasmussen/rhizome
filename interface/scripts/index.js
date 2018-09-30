var CURRENTNODEID = ''
var ORIGINALTITLE = ''
var ORIGINALCONTENT = ''

const openNode = function(id) {
  console.log('Opening ' + id)
  $.getJSON('./nodes/get/' + id, function(data) {
    console.log('Got:')
    console.log(data)
    CURRENTNODEID = data['_id']
    console.log('CURRENTNODEID: ' + CURRENTNODEID)
    $('#currentNodeTitle').html(data['title'])
    $('#currentNodeContent').html(data['content'])
  })
}

latest = []
const fetchLatest = function(data) {
  latest = data
  for(i = 0; i < Math.min(data.length, 5); i++) {
    let excerptLength = Math.min(200, data[i]['content'].length)
    newelem = '<div class="media text-muted pt-3"><p class="media-body pb-3 mb-0 small lh-125 border-bottom border-gray"><strong class="d-block text-gray-dark"><a href="#" onclick="openNode(\'' + data[i]['_id'] + '\')">' + data[i]['title'] + '</a></strong>' + data[i]['content'].substring(0, excerptLength) + '...</p></div>'
    $('#latestnodesdiv').append(newelem)
  }
}

$.getJSON('./nodes/latest', fetchLatest)

const onSave = function() {
  if (CURRENTNODEID != '') {
    $.post( "./nodes/update", { id: CURRENTNODEID, title: $('#currentNodeTitle').text(), content: document.getElementById('currentNodeContent').innerHTML}, function(data) {
      console.log('UPDATE NODE')
      console.log(data)
      $('#saveButton').prop('class', 'btn btn-primary disabled')
    })
  } else {
    $.post( "./nodes/new", { title: $('#currentNodeTitle').text(), content: document.getElementById('currentNodeContent').innerHTML}, function(data) {
      console.log('NEW NODE')
      console.log(data)
      CURRENTNODEID = data['_id']
      $('#saveButton').prop('class', 'btn btn-primary disabled')
    })
  }
}

const deleteCurrentNode = function() {
  if (CURRENTNODEID != '') {
    $.post('./nodes/delete', {id: CURRENTNODEID}, function(data) {
      console.log('Deleted ' + CURRENTNODEID)
      console.log(data)
    })
  }
}

$(function() {
    $('.confirm').click(function(e) {
        e.preventDefault();
        if (window.confirm("Are you sure?")) {
            location.href = this.href;
        }
    });
});
