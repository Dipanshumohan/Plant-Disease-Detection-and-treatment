import tensorflow as tf
from tensorflow.keras import layers, models
import matplotlib.pyplot as plt

dataset_dir = 'dataset'
img_height, img_width = 224, 224
batch_size = 32

print("--- 1. Loading and Splitting Data ---")
train_ds = tf.keras.utils.image_dataset_from_directory(
    dataset_dir,
    validation_split=0.2,
    subset="training",
    seed=123,
    image_size=(img_height, img_width),
    batch_size=batch_size
)

val_ds = tf.keras.utils.image_dataset_from_directory(
    dataset_dir,
    validation_split=0.2,
    subset="validation",
    seed=123,
    image_size=(img_height, img_width),
    batch_size=batch_size
)

print("\n--- 2. Building the CNN Brain ---")
model = models.Sequential([
    layers.Rescaling(1./255, input_shape=(img_height, img_width, 3)),
    layers.Conv2D(32, (3, 3), activation='relu'),
    layers.MaxPooling2D(),
    layers.Conv2D(64, (3, 3), activation='relu'),
    layers.MaxPooling2D(),
    layers.Conv2D(128, (3, 3), activation='relu'),
    layers.MaxPooling2D(),
    layers.Flatten(),
    layers.Dense(128, activation='relu'),
    layers.Dense(16, activation='softmax')
])

model.compile(optimizer='adam',
              loss=tf.keras.losses.SparseCategoricalCrossentropy(),
              metrics=['accuracy'])

print("\n--- 3. Training the AI ---")
# We use 10 epochs (passes through the data) which is a standard starting point for datasets this size.
epochs = 30
history = model.fit(
  train_ds,
  validation_data=val_ds,
  epochs=epochs
)

print("\n--- 4. Saving the Model ---")
# We save the model in the recommended 'Keras v3' format (.keras).
model.save('plant_disease_model.keras')
print("Model successfully saved as 'plant_disease_model.keras'!")

print("\n--- 5. Drawing the Results ---")
plt.plot(history.history['accuracy'], label='Training Accuracy')
plt.plot(history.history['val_accuracy'], label='Validation (Quiz) Accuracy')
plt.title('AI Learning Progress')
plt.ylabel('Accuracy')
plt.xlabel('Epoch')
plt.legend()
plt.show()