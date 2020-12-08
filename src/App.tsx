import React, { useState } from 'react';
import './App.css';
import { get } from './models/ApiClient';
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Container,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  LinearProgress,
  Radio,
  RadioGroup,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from '@material-ui/core';

type CourtResult = {
  date: string,
  courts: Array<any>,
  times: Array<any>,
}

class Court {
  court: string = '';
  result: Array<CourtResult> = [];
}


export const App: React.FC = () => {

  const [courts, setCourts] = useState(new Court());
  const [condTime, setCondTime] = useState('all');
  const [condCourt, setCondCourt] = useState({ aobadai: true, benzai: true, takinone: false, uchimagi: false });
  const [nighter, setNighter] = useState(false);
  const [loading, setLoading] = useState(false);

  const { aobadai, benzai, takinone, uchimagi } = condCourt;

  const handleCourtChange = (e: any) => {
    setCondCourt({ ...condCourt, [ e.target.name ]: e.target.checked });
  };

  // コートのデータを取得
  const fetchCourtData = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    setCourts(new Court());
    setLoading(true);
    try {
      const c = Object.keys(condCourt)
                      .filter(k => Object(condCourt)[ k ])
                      .map(k => k);
      const r = await get('http://203.138.144.214:8888/list/reservable',
                          { courts: c, time: condTime, nighter: nighter });
      if (!r) {
        setCourts(new Court());
      } else {
        setCourts(r.result.data);
      }
    } catch (e) {
      setCourts(new Court());
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fixed>
      <header className="App-header">
        <Box mb={2}>
          <Card>
            <CardContent>
              <FormControl component={'fieldset'}>
                <FormLabel component={'legend'}>時間</FormLabel>
                <RadioGroup row aria-label={'cond_time'} name={'cond_time'} defaultValue={'all'}>
                  <FormControlLabel
                    value={'all'}
                    label={'すべて'}
                    control={<Radio color={'primary'}/>}
                    onClick={() => setCondTime('all')}
                    labelPlacement={'end'}
                  />
                  <FormControlLabel
                    value={'am'}
                    label={'午前'}
                    control={<Radio color={'primary'}/>}
                    onClick={() => setCondTime('am')}
                    labelPlacement={'end'}
                  />
                  <FormControlLabel
                    value={'pm'}
                    label={'午後'}
                    control={<Radio color={'primary'}/>}
                    onClick={() => setCondTime('pm')}
                    labelPlacement={'end'}
                  />
                </RadioGroup>
                <FormLabel component={'legend'}>コート</FormLabel>
                <FormGroup row aria-label={'cond_court'}>
                  <FormControlLabel
                    label={'青葉台'}
                    control={<Checkbox color={'primary'} checked={aobadai} name={'aobadai'}/>}
                    onChange={(e) => handleCourtChange(e)}
                    labelPlacement={'end'}
                  />
                  <FormControlLabel
                    label={'弁財'}
                    control={<Checkbox color={'primary'} checked={benzai} name={'benzai'}/>}
                    onChange={(e) => handleCourtChange(e)}
                    labelPlacement={'end'}
                  />
                  <FormControlLabel
                    label={'滝の根'}
                    control={<Checkbox color={'primary'} checked={takinone} name={'takinone'}/>}
                    onChange={(e) => handleCourtChange(e)}
                    labelPlacement={'end'}
                  />
                  <FormControlLabel
                    label={'内間木'}
                    control={<Checkbox color={'primary'} checked={uchimagi} name={'uchimagi'}/>}
                    onChange={(e) => handleCourtChange(e)}
                    labelPlacement={'end'}
                  />
                </FormGroup>
                <FormLabel component={'legend'}>ナイター</FormLabel>
                <FormControlLabel
                  label={'含む'}
                  control={<Checkbox color={'primary'} checked={nighter} name={'nighter'}/>}
                  onChange={(e: any) => setNighter(e.target.checked)}
                  labelPlacement={'end'}
                />

              </FormControl>
              <Box mt={2}>
                <Button variant={'contained'} color={'primary'} onClick={(e) => fetchCourtData(e)}>検索</Button>
              </Box>
            </CardContent>
          </Card>
        </Box>
        <Card>
          <CardContent>
            {loading ? <LinearProgress/> : ''}
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>日付</TableCell>
                  <TableCell>コート名</TableCell>
                  <TableCell>時間</TableCell>
                  <TableCell>コート番号</TableCell>
                  <TableCell>空き状況</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {courts.result
                       .flatMap((r, i) => r.courts
                                           .filter(court => court.reserve)
                                           .map((court, j) => {
                                             return (
                                               <TableRow key={`${i}_${j}`}>
                                                 <TableCell>{r.date}</TableCell>
                                                 <TableCell>{court.facility}</TableCell>
                                                 <TableCell>{court.time}</TableCell>
                                                 <TableCell>{court.court}</TableCell>
                                                 <TableCell>{court.reserve ? '〇' : '×'}</TableCell>
                                               </TableRow>
                                             );
                                           }))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </header>
    </Container>
  );
};

export default App;
