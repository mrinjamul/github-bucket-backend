module.exports = function timestamp(schema) {
  // Add the two fields to the schema
  schema.add({
    created_at: Date,
    updated_at: Date,
  });

  // Create a pre-save hook
  schema.pre("save", function (next) {
    let now = Date.now();

    this.updated_at = now;
    // Set a value for createdAt only if it is null
    if (!this.created_at) {
      this.created_at = now;
    }
    // Call the next function in the pre-save chain
    next();
  });
};
