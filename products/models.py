from django.db import models


# Product Model
class Product(models.Model):
    product_name = models.CharField(max_length=100)
    category = models.CharField(max_length=50)
    brand = models.CharField(max_length=50)
    price = models.IntegerField()
    quantity = models.IntegerField()
    supplier = models.CharField(max_length=100)

    def __str__(self):
        return self.product_name
