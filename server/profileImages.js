ProfileImages = new Mongo.Collection('profileImages');
ProfileImages.attachSchema(new SimpleSchema({
  image: {
    type: String,
    autoform: {
      afFieldInput: {
        type: 'cloudinary'
      }
    }
  }
}));
