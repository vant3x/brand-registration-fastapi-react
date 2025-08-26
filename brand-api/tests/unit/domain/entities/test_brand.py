from app.domain.entities.brand import Brand
from app.shared.enums.brand_status import BrandStatus


def test_create_brand_entity():
    brand = Brand(marca="Test Brand", titular="Test Owner", status=BrandStatus.ACTIVO)

    assert brand.marca == "Test Brand"
    assert brand.titular == "Test Owner"
    assert brand.status == BrandStatus.ACTIVO
    assert brand.id is None
    assert brand.pais_registro == "Colombia"
    assert brand.imagen_url is None
    assert brand.created_at is None
    assert brand.updated_at is None


def test_create_brand_entity_with_optional_fields():
    brand = Brand(
        id=1,
        marca="Another Brand",
        titular="Another Owner",
        status=BrandStatus.INACTIVO,
        pais_registro="Colombia",
        imagen_url="http://example.com/image.png",
    )

    assert brand.id == 1
    assert brand.marca == "Another Brand"
    assert brand.titular == "Another Owner"
    assert brand.status == BrandStatus.INACTIVO
    assert brand.pais_registro == "Mexico"
    assert brand.imagen_url == "http://example.com/image.png"
