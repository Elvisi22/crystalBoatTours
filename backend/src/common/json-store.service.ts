import { Injectable } from '@nestjs/common';
import { promises as fs } from 'fs';
import { join } from 'path';

/**
 * Tiny file-backed JSON store. Good enough for bookings / contact / newsletter
 * without pulling in a database. Each "collection" is a single JSON array file
 * under <repo>/backend/data/<name>.json.
 */
@Injectable()
export class JsonStoreService {
  private readonly dir = join(process.cwd(), 'data');

  private file(name: string) {
    return join(this.dir, `${name}.json`);
  }

  private async ensureDir() {
    await fs.mkdir(this.dir, { recursive: true });
  }

  async readAll<T>(name: string): Promise<T[]> {
    try {
      const raw = await fs.readFile(this.file(name), 'utf-8');
      return JSON.parse(raw) as T[];
    } catch {
      return [];
    }
  }

  async append<T extends { id: string }>(name: string, item: T): Promise<T> {
    await this.ensureDir();
    const items = await this.readAll<T>(name);
    items.push(item);
    await fs.writeFile(this.file(name), JSON.stringify(items, null, 2), 'utf-8');
    return item;
  }

  async update<T extends { id: string }>(
    name: string,
    id: string,
    patch: Partial<T>,
  ): Promise<T | undefined> {
    await this.ensureDir();
    const items = await this.readAll<T>(name);
    const idx = items.findIndex((i) => i.id === id);
    if (idx === -1) return undefined;
    items[idx] = { ...items[idx], ...patch };
    await fs.writeFile(this.file(name), JSON.stringify(items, null, 2), 'utf-8');
    return items[idx];
  }

  async findOne<T extends { id: string }>(
    name: string,
    id: string,
  ): Promise<T | undefined> {
    const items = await this.readAll<T>(name);
    return items.find((i) => i.id === id);
  }
}
