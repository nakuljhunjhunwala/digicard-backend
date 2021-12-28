module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
      username:{
        type: String,
        required: true,
        unique: true
      },
      name:String,
      profession:String,
      profilePhoto:String,
      phoneNumber:Number,
      email:String,
      whatsappNumber:Number,
      skypeId:String,
      messengerId:String,
      shareableLink:String,
      address:String,
      website:String,
      facebookId:String,
      twitterId:String,
      instagramId:String,
      quoraId:String,
      githubId:String,
    },
    { timestamps: false }
  );

  schema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const User = mongoose.model("user", schema);
  return User;
};
