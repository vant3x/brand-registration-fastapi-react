import * as React from 'react';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';

interface Brand {
  id: string;
  marca: string;
  titular: string;
  status: string;
  pais_registro: string;
  imagen_url?: string;
  created_at?: string;
  updated_at?: string;
}

interface BrandTableRowProps {
  brand: Brand;
  isItemSelected: boolean;
  labelId: string;
  handleClick: (event: React.MouseEvent<unknown>, id: string) => void;
  handleView: (id: string) => void;
  handleEdit: (id: string) => void;
  handleDelete: (id: string) => void;
}

const BrandTableRow: React.FC<BrandTableRowProps> = ({
  brand,
  isItemSelected,
  labelId,
  handleClick,
  handleView,
  handleEdit,
  handleDelete,
}) => {
  return (
    <TableRow
      hover
      role="checkbox"
      aria-checked={isItemSelected}
      tabIndex={-1}
      key={brand.id}
      selected={isItemSelected}
    >
      <TableCell padding="checkbox">
        <Checkbox
          color="primary"
          checked={isItemSelected}
          inputProps={{
            'aria-labelledby': labelId,
          }}
          onClick={(event) => handleClick(event, brand.id)}
        />
      </TableCell>
      <TableCell
        component="th"
        id={labelId}
        scope="row"
        padding="none"
      >
        {brand.marca}
      </TableCell>
      <TableCell align="left">{brand.titular}</TableCell>
      <TableCell align="left">{brand.status}</TableCell>
      <TableCell align="left">{brand.pais_registro}</TableCell>
      <TableCell align="left">
        {brand.imagen_url ? (
          <img src={brand.imagen_url} alt={brand.marca} style={{ width: 50, height: 50, objectFit: 'cover' }} />
        ) : (
          'N/A'
        )}
      </TableCell>
      <TableCell align="left">
        <Tooltip title="Ver">
          <IconButton onClick={() => handleView(brand.id)} size="small">
            <VisibilityIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Editar">
          <IconButton onClick={() => handleEdit(brand.id)} size="small" color="warning">
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Eliminar">
          <IconButton onClick={() => handleDelete(brand.id)} size="small" color="error">
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
};

export default BrandTableRow;
