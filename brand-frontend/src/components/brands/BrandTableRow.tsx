import * as React from 'react';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Checkbox from   '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Brand } from '../../services/brandService';

interface BrandTableRowProps {
  brand: Brand;
  isItemSelected: boolean;
  labelId: string;
  handleClick: (event: React.MouseEvent<unknown>, id: string) => void;
  handleView: (id: string) => void;
  handleEdit: (id: string) => void;
  handleDelete: (id: string) => void;
}

const BrandTableRow = (props: BrandTableRowProps) => {
  const { brand, isItemSelected, labelId, handleClick, handleView, handleEdit, handleDelete } = props;

  return (
    <TableRow
      hover
      onClick={(event) => handleClick(event, brand.id)}
      role="checkbox"
      aria-checked={isItemSelected}
      tabIndex={-1}
      key={brand.id}
      selected={isItemSelected}
      sx={{ cursor: 'pointer' }}
    >
      <TableCell padding="checkbox">
        <Checkbox
          color="primary"
          checked={isItemSelected}
          inputProps={{
            'aria-labelledby': labelId,
          }}
        />
      </TableCell>
      <TableCell
        component="th"
        id={labelId}
        scope="row"
        padding="none"
      >
        {brand.id}
      </TableCell>
      <TableCell align="left">{brand.marca}</TableCell>
      <TableCell align="left">{brand.created_at ? new Date(brand.created_at).toLocaleDateString() : 'N/A'}</TableCell>
      <TableCell align="left">{brand.titular}</TableCell>
      <TableCell align="left">
      {brand.pais_registro}
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