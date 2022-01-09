import * as React from 'react';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Autocomplete from '@mui/material/Autocomplete';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';

export default function BasicPopover(props) {
  const { users, handleAddMember, ids, setIds, anchorEl, setAnchorEl } = props;
  // const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <div>
      <Button aria-describedby={id} variant="outlined" onClick={handleClick}>
        Invite
      </Button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        {users && (
          <div style={{ width: '500px' }}>
            <center>
              <Typography sx={{ p: 1 }} variant="subtitle2">
                Invite to board
              </Typography>
            </center>
            <Autocomplete
              sx={{ p: 1 }}
              multiple
              id="tags-filled"
              options={users.map((option) => option.username)}
              renderTags={(value, getTagProps) => {
                setIds(value);
                return value.map((option, index) => (
                  <Chip
                    variant="outlined"
                    label={option}
                    {...getTagProps({ index })}
                  />
                ));
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  fullWidth
                  label="Member"
                  placeholder="Username"
                />
              )}
            />
            <Button
              sx={{ m: 1, display: 'flex', justifyContent: 'flex-end' }}
              variant="contained"
              onClick={() => handleAddMember(ids)}
            >
              Simpan
            </Button>
          </div>
        )}
      </Popover>
    </div>
  );
}
