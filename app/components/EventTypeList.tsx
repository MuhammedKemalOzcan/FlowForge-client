interface Props {
  eventTypes: string[]
}

export function EventTypeList({ eventTypes }: Props) {

  
  return (
    <div>
      <p className="text-xs text-gray-400 mb-1">Event Types</p>
      <div className="flex flex-wrap gap-1.5">
        {eventTypes && eventTypes.map((type) => (
          <span key={type} className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-mono">
            {type}
          </span>
        ))}
      </div>
    </div>
  );
}
