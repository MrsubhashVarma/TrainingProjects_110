from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Product
from .serializers import ProductSerializer


# POST /products/add/ - Add a new product
@api_view(['POST'])
def add_product(request):
    serializer = ProductSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(
            {"message": "Product Added Successfully", "product": serializer.data},
            status=status.HTTP_201_CREATED
        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# GET /products/ - View all products
@api_view(['GET'])
def get_products(request):
    products = Product.objects.all()
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)


# PUT /products/update/<id>/ - Update product details
@api_view(['PUT'])
def update_product(request, pk):
    try:
        product = Product.objects.get(pk=pk)
    except Product.DoesNotExist:
        return Response(
            {"message": "Product Not Found"},
            status=status.HTTP_404_NOT_FOUND
        )

    serializer = ProductSerializer(product, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(
            {"message": "Product Updated Successfully", "product": serializer.data}
        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# DELETE /products/delete/<id>/ - Delete a product
@api_view(['DELETE'])
def delete_product(request, pk):
    try:
        product = Product.objects.get(pk=pk)
    except Product.DoesNotExist:
        return Response(
            {"message": "Product Not Found"},
            status=status.HTTP_404_NOT_FOUND
        )

    product.delete()
    return Response({"message": "Product Deleted Successfully"})
