import loadImage from 'image-promise';

export const ImageCache = {
  _cache: {},

  async getImages(imageUrls) {
    const notCashedImageUrls = imageUrls.filter(imageUrl => !(imageUrl in this._cache));
    const cashedImages = this.getCashedImages(imageUrls);

    if (notCashedImageUrls.length > 0) {
      const loadedImages = await loadImage(notCashedImageUrls);
      this.cacheImages(loadedImages, notCashedImageUrls);
      return this.getCashedImages(imageUrls);
    } else {
      return cashedImages;
    }
  },

  getCashedImages(imageUrls) {
    return imageUrls
      .filter(imageUrl => imageUrl in this._cache)
      .map(imageUrl => this._cache[imageUrl]);
  },
  cacheImages(images, urls) {
    images.forEach((img, i) => {
      if (urls[i]) {
        this._cache[urls[i]] = img;
      }
    });
  }
}