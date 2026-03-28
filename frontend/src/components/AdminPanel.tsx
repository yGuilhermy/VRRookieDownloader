'use client';

import { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Trash2, Edit, Database, AlertOctagon, RefreshCw, AlertTriangle, Download, UploadCloud } from 'lucide-react';
import { toast } from 'sonner';

interface Game {
  id: number;
  title: string;
  tags: string;
  genre: string;
  developer: string;
  publisher: string;
  version: string;
  languages: string;
  play_modes: string;
}

export default function AdminPanel() {
  const queryClient = useQueryClient();
  const [clearCount, setClearCount] = useState(0);
  const [editGame, setEditGame] = useState<Game | null>(null);
  const [backupConfirm, setBackupConfirm] = useState<{ tempPath: string; metadata: any } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { data } = useQuery<{ games: Game[] }>({
    queryKey: ['admin_games'],
    queryFn: async () => (await api.get('/games', { params: { limit: 10000 } })).data,
  });

  const games = data?.games || [];

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/games/${id}`),
    onSuccess: () => {
      toast.success('Jogo deletado do banco');
      queryClient.invalidateQueries({ queryKey: ['admin_games'] });
      queryClient.invalidateQueries({ queryKey: ['games'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (game: Game) => api.put(`/games/${game.id}`, { 
      title: game.title, 
      tags: game.tags,
      genre: game.genre,
      developer: game.developer,
      publisher: game.publisher,
      version: game.version,
      languages: game.languages,
      play_modes: game.play_modes
    }),
    onSuccess: () => {
      toast.success('Jogo atualizado');
      setEditGame(null);
      queryClient.invalidateQueries({ queryKey: ['admin_games'] });
      queryClient.invalidateQueries({ queryKey: ['games'] });
    },
  });

  const clearDbMutation = useMutation({
    mutationFn: () => api.delete('/db/clear'),
    onSuccess: () => {
      toast.success('Tabela de jogos completamente excluída.');
      setClearCount(0);
      queryClient.invalidateQueries({ queryKey: ['admin_games'] });
      queryClient.invalidateQueries({ queryKey: ['games'] });
    },
  });

  const handleClearDb = () => {
    if (clearCount < 4) {
      setClearCount(c => c + 1);
      toast.error(`Aviso: Tem certeza? Faltam ${4 - clearCount} confirmações para perder todos os dados.`);
    } else {
      clearDbMutation.mutate();
    }
  };

  const checkBackupMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      const res = await api.post('/db/import/check', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return res.data;
    },
    onSuccess: (data) => {
      setBackupConfirm({ tempPath: data.tempPath, metadata: data.metadata });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error || 'Erro ao ler arquivo de backup');
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  });

  const applyBackupMutation = useMutation({
    mutationFn: (tempPath: string) => api.post('/db/import/apply', { tempPath }),
    onSuccess: () => {
      toast.success('Backup restaurado com sucesso! A página será recarregada.');
      setBackupConfirm(null);
      setTimeout(() => window.location.reload(), 1500);
    },
    onError: (err: any) => toast.error(err.response?.data?.error || 'Erro ao aplicar backup')
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      checkBackupMutation.mutate(e.target.files[0]);
    }
  };

  const { data: failedData, refetch: refetchFailed } = useQuery<{ items: any[] }>({
    queryKey: ['failed_games'],
    queryFn: async () => (await api.get('/scraper/failed')).data,
  });

  const retryMutation = useMutation({
    mutationFn: (id: number) => api.post(`/scraper/failed/${id}/retry`),
    onSuccess: () => {
      toast.success('Tentando novamente...');
      refetchFailed();
      queryClient.invalidateQueries({ queryKey: ['admin_games'] });
    },
    onError: (err: any) => toast.error(err.response?.data?.error || 'Erro ao tentar novamente'),
  });

  const retryAllMutation = useMutation({
    mutationFn: async () => {
      const res = await api.post('/scraper/failed/retry-all');
      return res.data;
    },
    onSuccess: (data: any) => {
      toast.success(`Tentativa em massa concluída! Sucessos: ${data.successes}, Falhas: ${data.errors}`);
      refetchFailed();
      queryClient.invalidateQueries({ queryKey: ['admin_games'] });
    },
    onError: () => toast.error('Erro ao processar tentativa em massa'),
  });

  const failedItems = failedData?.items || [];

  return (
    <Card className="border-border/50 bg-card/60 backdrop-blur w-full mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5 text-indigo-500" /> Administração de Banco de Dados
        </CardTitle>
        <CardDescription>
          Visualize e edite manualmente os jogos inseridos pelo Scraper.
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="rounded-md border border-border/50 overflow-auto max-h-[400px] custom-scrollbar">
          <Table>
            <TableHeader className="bg-muted/50 sticky top-0 z-10">
              <TableRow>
                 <TableHead className="w-[80px]">ID</TableHead>
                <TableHead>Título</TableHead>
                <TableHead>Meta (Gênero/Dev)</TableHead>
                <TableHead className="text-right">Ação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {games.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">Nenhum dado encontrado.</TableCell>
                </TableRow>
              )}
              {games.map(game => (
                <TableRow key={game.id}>
                  <TableCell className="font-mono text-xs">{game.id}</TableCell>
                  <TableCell className="font-medium whitespace-nowrap overflow-hidden text-ellipsis max-w-[200px]" title={game.title}>
                    {game.title}
                  </TableCell>
                   <TableCell>
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-bold text-emerald-500 uppercase">{game.genre || 'Sem Gênero'}</span>
                      <span className="text-[9px] text-muted-foreground italic">{game.developer || 'Sem Dev'}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button size="icon" variant="ghost" onClick={() => setEditGame(game)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="destructive" onClick={() => deleteMutation.mutate(game.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      <CardFooter className="bg-muted/20 border-t border-border/50 pt-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <span className="text-sm text-muted-foreground mr-auto">Total de itens: {games.length}</span>
        
        <div className="flex flex-wrap items-center gap-2">
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept=".zip" 
            onChange={handleFileChange} 
          />
          <Button 
            variant="outline" 
            className="border-primary/50 text-primary hover:bg-primary/10"
            onClick={() => window.open('/api/db/export', '_self')}
          >
            <Download className="h-4 w-4 mr-2" /> Exportar Backup
          </Button>

          <Button 
            variant="secondary" 
            onClick={() => fileInputRef.current?.click()}
            disabled={checkBackupMutation.isPending}
          >
            <UploadCloud className="h-4 w-4 mr-2" /> 
            {checkBackupMutation.isPending ? 'Analisando...' : 'Importar Backup'}
          </Button>

          <Button 
            variant={clearCount > 0 ? 'destructive' : 'outline'} 
            className={clearCount > 2 ? 'animate-pulse font-bold' : ''}
            onClick={handleClearDb}
          >
            {clearCount === 0 && <><AlertOctagon className="h-4 w-4 mr-2 text-destructive" /> Limpar Database</>}
            {clearCount > 0 && `Confirmar apagamento ${clearCount}/5`}
          </Button>
        </div>
      </CardFooter>

      {/* Seção de Falhas */}
      <CardHeader className="border-t border-border/50 bg-muted/5 mt-4">
        <CardTitle className="flex items-center gap-2 text-amber-500">
          <AlertTriangle className="h-5 w-5" /> Itens com Falha no Scraping
        </CardTitle>
        <CardDescription>
          URLs que não puderam ser processadas devido a erros de conexão ou timeout.
        </CardDescription>
        {failedItems.length > 0 && (
          <div className="mt-2">
            <Button 
              size="sm" 
              variant="default"
              className="bg-amber-500 hover:bg-amber-600 text-white gap-2 border-none"
              disabled={retryAllMutation.isPending}
              onClick={() => retryAllMutation.mutate()}
            >
              <RefreshCw className={`h-4 w-4 ${retryAllMutation.isPending ? 'animate-spin' : ''}`} />
              {retryAllMutation.isPending ? 'Processando fila...' : 'Tentar Todos de uma Vez'}
            </Button>
          </div>
        )}
      </CardHeader>

      <CardContent>
        <div className="rounded-md border border-amber-500/20 overflow-auto max-h-[300px] custom-scrollbar">
          <Table>
            <TableHeader className="bg-amber-500/5 sticky top-0 z-10">
              <TableRow>
                <TableHead>URL / Erro</TableHead>
                <TableHead className="w-[100px]">Tentativas</TableHead>
                <TableHead className="text-right">Ação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {failedItems.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center h-20 text-muted-foreground italic">Nenhuma falha registrada.</TableCell>
                </TableRow>
              )}
              {failedItems.map((item: any) => (
                <TableRow key={item.id} className="group hover:bg-amber-500/5 transition-colors">
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-xs font-mono text-muted-foreground truncate max-w-[300px]" title={item.post_url}>
                        {item.post_url}
                      </span>
                      <span className="text-[10px] text-destructive font-bold">{item.error_message}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center font-bold text-amber-600">
                    {item.attempts}x
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="border-amber-500/30 hover:bg-amber-500/10 gap-2 h-8"
                      disabled={retryMutation.isPending}
                      onClick={() => retryMutation.mutate(item.id)}
                    >
                      <RefreshCw className={`h-3 w-3 ${retryMutation.isPending ? 'animate-spin' : ''}`} />
                      Tentar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      <CardFooter className="bg-amber-500/5 text-amber-600/60 text-[10px] py-2 px-6 rounded-b-xl border-t border-amber-500/10">
        Itens salvos aqui não aparecerão no catálogo principal até serem processados.
      </CardFooter>

      <Dialog open={!!editGame} onOpenChange={(v) => !v && setEditGame(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Editar Jogo #{editGame?.id}</DialogTitle>
            <DialogDescription>Altere as informações (título original, etiquetas) armazenadas no banco.</DialogDescription>
          </DialogHeader>
          {editGame && (
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título</Label>
                <Input 
                  id="title" 
                  value={editGame.title} 
                  onChange={e => setEditGame({ ...editGame, title: e.target.value })} 
                />
              </div>
               <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="genre">Gênero</Label>
                  <Input 
                    id="genre" 
                    value={editGame.genre || ''} 
                    onChange={e => setEditGame({ ...editGame, genre: e.target.value })} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="developer">Desenvolvedor</Label>
                  <Input 
                    id="developer" 
                    value={editGame.developer || ''} 
                    onChange={e => setEditGame({ ...editGame, developer: e.target.value })} 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="publisher">Editora</Label>
                  <Input 
                    id="publisher" 
                    value={editGame.publisher || ''} 
                    onChange={e => setEditGame({ ...editGame, publisher: e.target.value })} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="version">Versão</Label>
                  <Input 
                    id="version" 
                    value={editGame.version || ''} 
                    onChange={e => setEditGame({ ...editGame, version: e.target.value })} 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="languages">Idiomas</Label>
                  <Input 
                    id="languages" 
                    value={editGame.languages || ''} 
                    onChange={e => setEditGame({ ...editGame, languages: e.target.value })} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="play_modes">Modos de Jogo</Label>
                  <Input 
                    id="play_modes" 
                    value={editGame.play_modes || ''} 
                    onChange={e => setEditGame({ ...editGame, play_modes: e.target.value })} 
                  />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditGame(null)}>Cancelar</Button>
            <Button onClick={() => editGame && updateMutation.mutate(editGame)}>Salvar Alterações</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!backupConfirm} onOpenChange={(v) => !v && setBackupConfirm(null)}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>Importar Banco de Dados</DialogTitle>
            <DialogDescription>
              Um backup válido foi encontrado. Ao continuar, sua database <strong>atual será apagada</strong> 
              e os dados do backup serão aplicados. Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          {backupConfirm && (
            <div className="bg-muted/50 p-4 rounded-xl text-sm space-y-2 font-mono">
              <p><strong>Criação:</strong> {new Date(backupConfirm.metadata.created_at).toLocaleString()}</p>
              <p><strong>Código de Validação:</strong> <span className="text-emerald-500 font-bold blur-sm hover:blur-none transition-all duration-300 cursor-help select-none" title="Passe o mouse para revelar">{backupConfirm.metadata.validation_code}</span></p>
              <p><strong>Arquivos:</strong> {backupConfirm.metadata.files.join(', ')}</p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setBackupConfirm(null);
              if (fileInputRef.current) fileInputRef.current.value = '';
            }}>Cancelar</Button>
            <Button 
              variant="destructive" 
              onClick={() => backupConfirm && applyBackupMutation.mutate(backupConfirm.tempPath)}
              disabled={applyBackupMutation.isPending}
            >
              {applyBackupMutation.isPending ? 'Aplicando...' : 'Apagar Tudo e Substituir'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
