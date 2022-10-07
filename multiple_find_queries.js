db = connect( 'mongodb+srv://blog:4p8moFTYv2hWhpbf@blog.xd7fbif.mongodb.net/sample_training?readPreference=secondary' );

function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}

for (let i = 0; i < 1_000; i++) {
  delay(500).then(() => db.posts.findOne({}));
}
